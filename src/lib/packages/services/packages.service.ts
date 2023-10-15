import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CreatePackageDto } from "../dto/create-package.dto";
import { Package } from "../entities/package.entity";
import { HttpService } from "@nestjs/axios";
import { AxiosResponse } from "axios";
import { Observable } from "rxjs";
import { v4 as uuidv4 } from 'uuid';
var CryptoJSX = require("crypto-js");

@Injectable()
export class PackagesService {
  constructor(
    @InjectRepository(Package)
    private packagesRepository: Repository<Package>,
    private readonly httpService: HttpService
  ) { }

  create(createPackageDto: CreatePackageDto, user) {
    const data = {
      ...createPackageDto,
      user
    };

    return this.packagesRepository.save(
      this.packagesRepository.create(data),
    );
  }

  async getQuotation(): Promise<Observable<AxiosResponse<any, any>>> {
    const body = {}
    console.log("LALA TEST")

    const SECRET = 'sk_test_sok9yQ0cIWWq+uC7hEneNHHEzUunwovtkdhcsrl33q63p8Y+MxJfurFGayGYdlMw';
    const time = new Date().getTime().toString(); // => `1545880607433`

    const method = 'POST';
    // const path = '/v3/cities';
    const path = '/v3/quotations';


    const pickupCo = {
      lat: "13.678110",
      lng: "100.629204",
    };

    const dropoffCo = {
      lat: "14.573400",
      lng: "100.574348",
    };

    const pickup = {
      coordinates: pickupCo,
      address: "Innocentre, 72 Tat Chee Ave, Kowloon Tong",
    };

    const dropoff = {
      coordinates: dropoffCo,
      address: "Statue Square, Des Voeux Rd Central, Central",
    };

    const payload = {
      "data": {
        "scheduleAt": "2023-03-12T14:30:00.00Z",
        "serviceType": "MOTORCYCLE",
        "specialRequests": ["PURCHASE_SERVICE_1"],
        "language": "en_TH",
        "stops": [pickup, dropoff],
        "item": {
          "quantity": "3",
          "weight": "LESS_THAN_3KG",
          "categories": ["OFFICE_ITEM"],
          "handlingInstructions": ["KEEP_UPRIGHT"]
        },
        "isRouteOptimized": true,
      }
    }



    const bodyText = JSON.stringify(payload); // => the whole body for '/v3/quotations'

    const rawSignature = `${time}\r\n${method}\r\n${path}\r\n\r\n${bodyText}`;
    //const rawSignature = `${time}\r\n${method}\r\n${path}\r\n\r\n`; if the method is GET
    // => '1546222219293\r\nPOST\r\n/v3/quotations\r\n\r\n{\n"data":{...}'


    const SIGNATURE = CryptoJSX.HmacSHA256(rawSignature, SECRET).toString();

    const API_KEY = 'pk_test_bde64b0c91a835dfc1725905a11b1151'
    const TOKEN = `${API_KEY}:${time}:${SIGNATURE}`



    const headersRequest = {
      'Content-Type': 'application/json', // afaik this one is not needed
      'Authorization': `hmac ${TOKEN}`,
      'Market': 'TH',
      'Request-ID': uuidv4()
    };


    console.log("UUID", uuidv4())

    try {
      console.log("LOL")
      this.httpService.post('https://rest.sandbox.lalamove.com/v3/quotations', payload, { headers: headersRequest }).subscribe((resp) => {
        console.log(resp.data)
      }, (err) => {
        console.log("ERROR", err.response.data)
      })

      console.log("success")
      return null;

    } catch (err) {

    }
  }
}