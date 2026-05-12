import { Products } from "../../interfaces/products.interface"

export const productsData = {
    wirelessHeadphones: {
        name: "Wireless Headphones",
        quantity: "1",
        price: "120"
    },
    smartphoneStand: {
        name: "Smartphone Stand",
        quantity: "1",
        price: "45"
    },
    bluetoothSpeaker: {
        name: "Bluetooth Speaker",
        quantity: "1",
        price: "80"
    },
    laptopBackpack: {
        name: "Laptop Backpack",
        quantity: "1",
        price: "100"
    },
    fitnessBand: {
        name: "Fitness Band",
        quantity: "1",
        price: "60"
    }
} satisfies Record<string, Products>