import { Products } from "../../interfaces/products.interface"
import { productsData } from "./productPurchasingDefaultProducts"
import { UserData } from "../../interfaces/userData.interface"
import { userData } from "../userData"

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
    ] as Products[],

    billing_form_validation: [
        productsData.smartphoneStand
    ] as Products[],

    successfull_payment_flow: [
        productsData.laptopBackpack,
        productsData.bluetoothSpeaker
    ] as Products[]
};

export const user = {
    successfull_payment_flow: [
        userData.userBigBird
    ] as UserData[],

    failed_payment_flow: [
        userData.userBigBird
    ] as UserData[]
};
