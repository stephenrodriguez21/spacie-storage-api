import { HttpService } from "@nestjs/axios";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CreatePackageDto } from "../packages/dto/create-package.dto";
import { CreateAddressDto } from "./dto/create-address.dto";
import { Address } from "./entities/address.entity";

@Injectable()
export class AddressService {
  constructor(
    @InjectRepository(Address)
    private addressRepository: Repository<Address>,
    private readonly httpService: HttpService
  ) { }

  create(createAddressDto: CreateAddressDto, user) {
    console.log("USER", user)
    const data: any = {
      ...createAddressDto,
      userId: user.id
    };

    return this.addressRepository.save(
      this.addressRepository.create(data),
    );
  }
}