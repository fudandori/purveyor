class Item {
    #id
    #name
    #expiryDate

    constructor(id, name, expiryDate) {
        this.#id = id
        this.#name = name
        this.#expiryDate = new Date(expiryDate)
    }
    get name() {
        return this.#name
    }   
    isExpired() {
        const today = new Date()
        return today > this.#expiryDate
    }   
    daysUntilExpiry() {
        const today = new Date()
        const timeDiff = this.#expiryDate - today
        return Math.ceil(timeDiff / (1000 * 60 * 60 * 24))
    }
    toString() {
        return `${this.#name} (expires on: ${this.#expiryDate.toDateString()})`
    }
}
class Inventory {
    #name
    #items

    constructor(name) {
        this.#name = name
        this.#items = []
    }
    get name() {
        return this.#name
    }
    set name(value) {
        this.#name = value
    }
    addItem(item) {
        this.#items.push(item)
    }
    removeItem(id) {
        this.#items = this.#items.filter(item => item.id !== id)
    }
    listItems() {
        return this.#items.map(item => item.toString())
    }   
    getExpiredItems() {
        return this.#items.filter(item => item.isExpired())
    }
    getItemsExpiringInDays(days) {
        return this.#items.filter(item => item.daysUntilExpiry() <= days)
    }
}

// Example usage:
const inventory = new Inventory()
const milk = new Item('Milk', '2024-06-10')
const bread = new Item('Bread', '2024-06-05')
const cheese = new Item('Cheese', '2024-07-01')
