import mongoose from 'mongoose';
import cities from './cities.js';
import { places, descriptors } from './seedHelpers.js'
import Campground from '../models/campground.js'

main().catch(err => console.log(err));

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp');
    console.log('Database Connected')
}

const sample = array => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
    await Campground.deleteMany({});
    for (let i = 0; i < 50; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const randomPrice = Math.floor(Math.random() * 100) + 20;
        const camp = new Campground({
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            image: `https://picsum.photos/400?random=${Math.floor(Math.random() * 100)}`,
            description: `Camping under the stars with a crackling campfire nearby and the gentle rustle of leaves is the perfect way to unwind and reconnect with nature.`,
            price: randomPrice
        })
        await camp.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close().then(() => {
        console.log("Connection Closed")
    });
})