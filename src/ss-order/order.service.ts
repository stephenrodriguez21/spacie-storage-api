import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Brackets, DataSource, EntityManager, Repository } from "typeorm";
import { Order } from "./entities/order.entity";
import { OrderItem } from "./entities/orderItem.entity";
import { StorageLocationArea } from "../ss-storage/entities/storageLocationArea.entity";
import { TransactionContext } from "../database/factories/transaction.context";
import { OrderSequence } from "./entities/orderSequence.entity";
import { Box } from "../lib/packages/entities/box.entity";
import { PageMetaDto } from "../lib/packages/dto/page-meta.dto";
import { PageOptionsDto } from "../lib/packages/dto/page-option.dto";
import { PageDto } from "../lib/packages/dto/page.dto";
import { ListFilter } from "../utils/types/pagination-options";
import { createPdf } from '@saemhco/nestjs-html-pdf';
import * as path from 'path';
import { OrderLabelMapper } from "./mappers/order-label.mapper";
const randomstring = require("randomstring");

export const labelConfig = {
    format: 'a5',
    printBackground: true,
    margin: {
        left: '0mm',
        top: '0mm',
        right: '0mm',
        bottom: '0mm',
    }
}

@Injectable()
export class OrderService {
    constructor(
        @InjectRepository(StorageLocationArea)
        private storageLocationAreaRepository: Repository<StorageLocationArea>,
        @InjectRepository(Order)
        private orderRepository: Repository<Order>,
        @InjectRepository(Box)
        private boxRepository: Repository<Box>,
        private readonly transactionContext: TransactionContext,
        private readonly dataSource: DataSource
    ) { }

    public async getPagedOrders(
        listFilter: ListFilter
    ): Promise<PageDto<any>> {
        const { filterOptions } = listFilter;
        let queryBuilder = this.orderRepository.createQueryBuilder("ssorders");
        // if (filterOptions) {
        //     filterOptions.map(filter => {
        //         switch (filter.column) {
        //             case 'dueDate': {
        //                 let filterDate = new Date();
        //                 if (filter.value === 'due_tomorrow') {
        //                     filterDate = new Date(filterDate.setDate(filterDate.getDate() + 1));
        //                 } else if (filter.value === 'due_in_3days') {
        //                     filterDate = new Date(filterDate.setDate(filterDate.getDate() + 3));
        //                 }
        //                 var year = filterDate.toLocaleString("default", { year: "numeric" });
        //                 var month = filterDate.toLocaleString("default", { month: "2-digit" });
        //                 var day = filterDate.toLocaleString("default", { day: "2-digit" });
        //                 const dateValue = `${year}-${month}-${day}`;
        //                 queryBuilder.andWhere("order.dueDate = :date", { date: dateValue });
        //                 break;
        //             }
        //             default: queryBuilder.andWhere(`order.${filter.column} = :value`, { value: filter.value });
        //         }
        //     })
        // }

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

    async createOrder(createOrderDto: any) {
        await this.transactionContext.run(async transactionManager => await this.createOrderWithTransaction(createOrderDto, transactionManager));
    }

    async downloadOrderLabelPDF(orderNumber: string, res: any) {
        const dx = path.join(__dirname, '../assets', 'order-label.hbs')
        let order = await this.orderRepository.createQueryBuilder("ssorders")
        .leftJoinAndSelect('ssorders.orderItem', 'items',)
        .leftJoinAndSelect('items.storageLocationArea', 'storageLocationArea',)
        .leftJoinAndSelect('storageLocationArea.storageLocation', 'storageLocation',)
        .leftJoinAndSelect('storageLocation.storage', 'storage',)
        .where('ssorders.orderNumber = :orderNumber', { orderNumber })
        .getOne();
        const mapped = OrderLabelMapper.mapOrderEntityToLabelDto(order)
        const buffer = await createPdf(dx, labelConfig, mapped);

        return buffer
    }

    async createOrderWithTransaction(data: any, transactionManager: EntityManager) {
        const { order } = data;
        order.orderNumber = await this.generateOrderNumber(transactionManager);
        const freeAreaIds = await this.getAllAvailableLocationAreaIds();
        order.totalCost = 0;
        order.vendorId = 1;
        order.storageId = 1;
        await transactionManager.insert(Order, order)

        await Promise.all(
            order.items.map(async (item) => {
                const storegeAreaId = freeAreaIds.splice(0, 1)
                const orderItem = {
                    ...item,
                    orderId: order.orderNumber,
                    storageLocationId: 1,
                    storageLocationAreaId: storegeAreaId ? storegeAreaId[0] : null,
                    cost: await this.calculateOrderItemCost(item),
                    hash: randomstring.generate(6).toUpperCase()
                }
                order.totalCost += orderItem.cost;
                const createdOrderItem = await transactionManager.insert(OrderItem, orderItem);
                if (storegeAreaId) {
                    await transactionManager.update(StorageLocationArea, { id: storegeAreaId[0] }, { orderItemId: createdOrderItem.identifiers[0].id });
                }
            }),
        );
        await transactionManager.save(Order, order)
    }

    private async generateOrderNumber(transactionManager: EntityManager) {
        const orderSequence = await transactionManager.findOne(OrderSequence, { where: { vendorId: '1' } });
        let seq = Number(orderSequence.currentSquence)
        seq += 1;
        orderSequence.currentSquence = seq.toString()
        await transactionManager.save(orderSequence)
        return `${orderSequence.orderPrefix}${orderSequence.currentSquence}`
    }

    private async getAllAvailableLocationAreaIds() {
        const availableLocationAreas = await this.storageLocationAreaRepository.createQueryBuilder('storageArea')
            .where(
                new Brackets((qb) => {
                    qb.where("storageArea.orderItemId is null")
                    qb.andWhere("storageArea.storageLocationId = :storageLocationId", {
                        storageLocationId: 1,
                    })
                }),
            ).getMany()

        return availableLocationAreas.map(x => x.id)
    }

    private async calculateOrderItemCost(item: any) {
        const boxDetail = await this.boxRepository.findOne({ where: { id: item.id } });
        return boxDetail.cost * item.quantity;
    }
}
