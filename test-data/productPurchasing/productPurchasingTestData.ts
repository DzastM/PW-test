import { Products } from "../../interfaces/products.interface"
import { productsData } from "./productPurchasingDefaultProducts"

export const cartProducts = { 
    add_to_cart_and_verify: [
        productsData.bluetoothSpeaker
    ] as Products[],

    increase_decrease: [
        productsData.wirelessHeadphones,
        productsData.fitnessBand
    ] as Products[],

    remove_product: [
        productsData.fitnessBand,
        productsData.wirelessHeadphones
    ] as Products[]
};