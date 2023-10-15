import { Injectable } from "@nestjs/common";
import { ApiProperty } from "@nestjs/swagger";
import { InjectRepository } from "@nestjs/typeorm";
import { Address } from "../../../lib/address/entities/address.entity";
import { ScanResultDto } from "src/lib/codes/dto/scan-result.dto";
import { Code } from "../../../lib/codes/entities/code.entity";
import { ListFilter } from "../../../utils/types/pagination-options";
import { Connection, In, Not, Repository } from "typeorm";
import { PageMetaDto } from "../dto/page-meta.dto";
import { PageOptionsDto } from "../dto/page-option.dto";
import { PageDto } from "../dto/page.dto";
import { Customer } from "../entities/customer.entity";
import { Order } from "../entities/order.entity";
import { OrderStatus } from "../enums/order.enum";

export class UserDto {
    @ApiProperty()
    public boxId: number;

    @ApiProperty()
    public isTagged: boolean;
}

@Injectable()
export class ScanService {
    constructor(
        @InjectRepository(Code)
        private codeRepository: Repository<Code>,
        @InjectRepository(Customer)
        private customerRepository: Repository<Customer>,
        @InjectRepository(Order)
        private orderRepository: Repository<Order>,
        private connection: Connection
    ) { }

    async getCodeBox(code: string) {
        return await this.codeRepository.findOne({
            where: { id: code },
            relations: ['box']
        });
    }
    

    async assignCodeToCustomer(req: any, body: any) {
        let { customerId, addressId, code } = body;
        const codeDetail = await this.codeRepository.findOne({ where: { id: code } });
        const queryRunner = this.connection.createQueryRunner();

        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            if (!codeDetail.isTagged) {
                if (!customerId) {
                    const customer = new Customer();
                    customer.firstName = body.firstname;
                    customer.lastName = body.lastname;
                    customer.phone = body.phone;

                    const address = new Address();
                    address.firstName = body.firstname;
                    address.lastName = body.lastname;
                    address.phone = body.phone;
                    address.address = body.address;
                    address.zipCode = body.zipcode;
                    address.district = body.district;
                    address.latitude = '100.2344';
                    address.longitude = '37.23443';
                    address.province = 'Bangkok';

                    await queryRunner.manager.save(customer);
                    address.customerId = customer.id;
                    await queryRunner.manager.save(address);
                    customerId = customer.id;
                    addressId = address.id;
                }


                const order = new Order();
                order.addressId = addressId;
                order.customerId = customerId;
                order.orderStatus = OrderStatus.SEND_BOX;
                order.storageDuration = body.duration;
                const createdOrder = await queryRunner.manager.save(order);

                codeDetail.isTagged = true;
                codeDetail.orderId = createdOrder.id;

                for (let boxId of body.boxIds) {
                    const boxCode = await queryRunner.manager.findOne(Code, { where: { id: boxId } });
                    if (boxCode) {
                        boxCode.isTagged = true;
                        boxCode.orderId = createdOrder.id;
                        await queryRunner.manager.save(boxCode);
                    }
                }

                await queryRunner.manager.save(codeDetail);
                await queryRunner.commitTransaction();
            }
        } catch (err) {
            await queryRunner.rollbackTransaction();
        } finally {
            await queryRunner.release();
        }
    }

    async generateCode(req: any, body: any) {
        const codeEntries = [];

        for (let i = 0; i < body.count; i++) {
            const code = new Code()
            code.boxId = body.size.value;
            codeEntries.push(code);
        }

        const result = await this.codeRepository.createQueryBuilder()
            .insert()
            .into(Code)
            .values(codeEntries)
            .execute();

        console.log('RESULT**', result);

        const codeIds = result.raw.map(r => r.id)

        const codeList = await this.codeRepository.findBy({
            id: In(codeIds)
        });

        return codeList;
    }

    async getBoxByCode(code: string) {
        const data = this.codeRepository.findOne({ where: { hash: code, isTagged: false }, relations: ['box'] })
        return data;
    }

    public async getQRCodeList(
        listFilter: ListFilter
    ): Promise<PageDto<any>> {
        const { filterOptions } = listFilter;
        let queryBuilder = this.codeRepository.createQueryBuilder("code");
        if (filterOptions) {
            filterOptions.map(filter => {
                switch (filter.column) {
                    case 'dueDate': {
                        let filterDate = new Date();
                        if (filter.value === 'due_tomorrow') {
                            filterDate = new Date(filterDate.setDate(filterDate.getDate() + 1));
                        } else if (filter.value === 'due_in_3days') {
                            filterDate = new Date(filterDate.setDate(filterDate.getDate() + 3));
                        }
                        var year = filterDate.toLocaleString("default", { year: "numeric" });
                        var month = filterDate.toLocaleString("default", { month: "2-digit" });
                        var day = filterDate.toLocaleString("default", { day: "2-digit" });
                        const dateValue = `${year}-${month}-${day}`;
                        queryBuilder.andWhere("order.dueDate = :date", { date: dateValue });
                        break;
                    }
                    default: queryBuilder.andWhere(`order.${filter.column} = :value`, { value: filter.value });
                }
            })
        }

        queryBuilder.leftJoinAndSelect("code.box", "box");

        // queryBuilder.leftJoinAndSelect("order.codes", "codes")
        //     .leftJoinAndSelect("order.customer", "customer")
        //     .leftJoinAndSelect("order.address", "address")
        //     .leftJoinAndSelect("codes.box", "box");

        queryBuilder
            //   .orderBy("user.createdAt", pageOptionsDto.order)
            .skip((listFilter.page - 1) * listFilter.pageSize)
            .take(listFilter.pageSize);

        const itemCount = await queryBuilder.getCount();
        const { entities } = await queryBuilder.getRawAndEntities();

        const pageOptionsDto: PageOptionsDto = {
            page: listFilter.page,
            skip: 0,
            take: listFilter.pageSize,
        }

        const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto });
        return new PageDto(entities, pageMetaDto);
    }

    public async getCodesList(
        listFilter: ListFilter
    ): Promise<PageDto<any>> {
        const { filterOptions } = listFilter;
        let queryBuilder = this.orderRepository.createQueryBuilder("order");
        if (filterOptions) {
            filterOptions.map(filter => {
                switch (filter.column) {
                    case 'dueDate': {
                        let filterDate = new Date();
                        if (filter.value === 'due_tomorrow') {
                            filterDate = new Date(filterDate.setDate(filterDate.getDate() + 1));
                        } else if (filter.value === 'due_in_3days') {
                            filterDate = new Date(filterDate.setDate(filterDate.getDate() + 3));
                        }
                        var year = filterDate.toLocaleString("default", { year: "numeric" });
                        var month = filterDate.toLocaleString("default", { month: "2-digit" });
                        var day = filterDate.toLocaleString("default", { day: "2-digit" });
                        const dateValue = `${year}-${month}-${day}`;
                        queryBuilder.andWhere("order.dueDate = :date", { date: dateValue });
                        break;
                    }
                    default: queryBuilder.andWhere(`order.${filter.column} = :value`, { value: filter.value });
                }
            })
        }

        queryBuilder.leftJoinAndSelect("order.codes", "codes")
            .leftJoinAndSelect("order.customer", "customer")
            .leftJoinAndSelect("order.address", "address")
            .leftJoinAndSelect("codes.box", "box");

        queryBuilder
            //   .orderBy("user.createdAt", pageOptionsDto.order)
            .skip((listFilter.page - 1) * listFilter.pageSize)
            .take(listFilter.pageSize);

        const itemCount = await queryBuilder.getCount();
        const { entities } = await queryBuilder.getRawAndEntities();

        const pageOptionsDto: PageOptionsDto = {
            page: listFilter.page,
            skip: 0,
            take: listFilter.pageSize,
        }

        const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto });
        return new PageDto(entities, pageMetaDto);
    }

    async editOrder(orderId: number, user): Promise<ScanResultDto> {
        const item = await this.orderRepository.findOne({
            where: { id: orderId },
            relations: ['codes', 'codes.box']
        });

        let result: ScanResultDto = {
            data: item,
            errors: []
        }

        return result;
    }

    async findCustomerByPhoneNumber(phone: string): Promise<any> {
        const customer = await this.customerRepository.findOne({ where: { phone }, relations: ['addresses'] });

        return customer
    }

    async getCode(code: string): Promise<ScanResultDto> {
        const item = await this.codeRepository.findOne({
            where: { id: code },
            relations: ['box', 'order']
        });

        if (item?.orderId) {
            if (item.order.orderStatus === OrderStatus.IN_STORAGE) {
                item.order['dueDateStr'] = item.order.dueDate.toDateString();
                item['receivedAtStr'] = item.receivedAt.toDateString();
            }

            if (item.order.boxCount > 1) {
                item.order['otherBoxes'] = await this.codeRepository.find({
                    where: { orderId: item.orderId, hash: Not(item.hash) },
                    relations: ['box']
                })
            }
        }
        let result: ScanResultDto = {
            data: item,
            errors: []
        }

        return result;
    }

    async boxReceived(code: string, orderId: number): Promise<any> {
        const item = await this.codeRepository.findOne({
            where: { id: code },
        });

        const orderCodes = await this.codeRepository.find({
            where: { orderId: orderId },
        });

        const scannedCode = orderCodes.find(x => x.id === code);
        if (scannedCode) {
            scannedCode.receivedAt = new Date();
            await this.codeRepository.save(scannedCode);

            const allBoxReceived = orderCodes.every(e => e.receivedAt !== null);
            if (allBoxReceived) {
                const order = await this.orderRepository.findOne({ where: { id: orderId } });
                order.orderStatus = OrderStatus.IN_STORAGE;

                var startDate = new Date();
                var dueDate = new Date();
                dueDate.setDate(startDate.getDate() + (order.storageDuration * 30));
                order.dueDate = dueDate;

                await this.orderRepository.save(order);
            }
        }

        // item.receivedAt = new Date();

        //await this.codeRepository.save(item);
        return item;
    }


}