import { Order } from "../entities/order.entity";
import { OrderItem } from "../entities/orderItem.entity";

const boxes = [
    { boxId: 1, code: 'SM', dim: '12 x 12 x 12', maxWeight: '1KG' },
    { boxId: 2, code: 'MD', dim: '25 x 25 x 25', maxWeight: '5KG' },
    { boxId: 3, code: 'LG', dim: '40 x 40 x 40', maxWeight: '10KG' }
]



export class OrderLabelMapper {

    public static mapOrderEntityToLabelDto(order: Order) {
        return {
            orderItem: this.mapOrderItemEntityToLabelDto(order)
        }
    }

    public static mapOrderItemEntityToLabelDto(order: Order) {
        const bangkokTime = order.createdAt.setHours(order.createdAt.getHours() + 7);
        const orderCreatedOn = new Date(bangkokTime).toString().replace('(Indochina Time)', ('ICT'))
        const totalBox = order.orderItem.length;

        return order.orderItem.map((item, index) => {
            const box = boxes.find(x => x.boxId === item.boxId)
            return {
                ...order,
                ...item,
                boxName: `${box.code} Box (${index + 1}/${totalBox})`,
                orderCreatedOn,
                //storageLocation: `${item.storageLocationArea.storageLocation.storage.storageName}-${item.storageLocationArea.storageLocation.locationName}-${item.storageLocationAreaId}`
            }
        })
    }
}