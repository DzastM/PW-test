import { UserData } from "../interfaces/userData.interface"

export const userData = {
    userBigBird: {
        name: "Big",
        surname: "Bird",
        address: "Sesame Street 123, Anywhere"
    }
} satisfies Record<string, UserData>