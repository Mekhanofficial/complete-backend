interface Task {
    id: number;
    title: string;
    description: string;
    isCompleted: boolean;
}

interface Item{
    id: number;
    name: string;
    price: number;
    isAvailable: boolean;
}

let itemList: Item[] = [
    { id: 1, name: "Laptop", price: 999.99, isAvailable: true },
    { id: 2, name: "Smartphone", price: 499.99, isAvailable: false },
    { id: 3, name: "Headphones", price: 199.99, isAvailable: true }
];

const getItems = (): Item[] => {
    return itemList.filter(item => item.isAvailable);
};



const createItem = (newItem: Item): void => {
    itemList.push(newItem);
    console.log(`Item "${newItem.name}" added successfully!`);

}


createItem({ id: 4, name: "Tablet", price: 299.99, isAvailable: true });

console.log("Available items:", getItems());