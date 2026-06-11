import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    console.log("starting seeding");

    await prisma.room.createMany({
        data: [
            {
                id: 32,
                name: 'Standard City Corner',
                description: 'a room for one person, with a good city view in the corner',
                price: 9.99,
                isAvailable: true,
                Category: 'standard',
                imageUrl: 'https://res.cloudinary.com/dyxz9pqi0/image/upload/v1757605945/single-standard-2-orig_wide_pesup1.jpg',
            },
            {
                id: 33,
                name: 'Pebble Nook',
                description: 'Compact and quiet, styled with stone textures and soft linens,Ideal for budget-friendly, restful nights.',
                price: 8.99,
                isAvailable: true,
                Category: 'standard',
                imageUrl: 'https://res.cloudinary.com/dyxz9pqi0/image/upload/v1757605920/160579861_Royal_National_Room_Standard_Single_2640x1760_s00hp7.jpg',
            },
            {
                id: 34,
                name: 'Lantern Loft',
                description: 'Cozy, light-filled room with warm accents and a soft reading chair. Perfect for solo stays or quick city stopovers.',
                price: 10.99,
                isAvailable: true,
                Category: 'standard',
                imageUrl: 'https://res.cloudinary.com/dyxz9pqi0/image/upload/v1757605897/single2_jg2kqq.jpg',
            },
            {
                id: 35,
                name: 'Maple Street Room',
                description: 'Calm, neighborhood vibe with maple-toned finishes and a tidy desk.A simple, comfortable base for your plans.',
                price: 12.99,
                isAvailable: true,
                Category: 'standard',
                imageUrl: 'https://res.cloudinary.com/dyxz9pqi0/image/upload/v1757605868/single_room1_a5eexr.jpg',
            },
            {
                id: 36,
                name: 'Twin Pines',
                description: 'Two plush beds under pine-accent decor for friends or family.Fresh air feel with ample space to unwind.',
                price: 19.99,
                isAvailable: true,
                Category: 'double',
                imageUrl: 'https://res.cloudinary.com/dyxz9pqi0/image/upload/v1757185658/hotel-doublebeds-web-550x306_tmjwij.jpg',
            },
            {
                id: 37,
                name: 'Skyline Pair',
                description: 'Modern double room with cityline touches and bright windows.Balanced for comfort, work, and rest..',
                price: 22.99,
                isAvailable: true,
                Category: 'double',
                imageUrl: 'https://res.cloudinary.com/dyxz9pqi0/image/upload/v1757185655/Grand-Double-Double_jjf4by.jpg',
            },
            {
                id: 38,
                name: 'Dune Duo',
                description: 'Sun-washed palette, twin beds, and coastal textures. Great for shared stays after a day out.',
                price: 21.99,
                isAvailable: true,
                Category: 'double',
                imageUrl: 'https://res.cloudinary.com/dyxz9pqi0/image/upload/v1757185642/Superior_Double_-_Double_Room_blbiyh.webp',
            },
            {
                id: 39,
                name: 'Orchard Twin',
                description: 'Fresh apple-wood tones and two comfy beds. Bright, cheerful space to recharge together.',
                price: 20.99,
                isAvailable: true,
                Category: 'double',
                imageUrl: 'https://res.cloudinary.com/dyxz9pqi0/image/upload/v1757185597/2_vkimir.webp',
            },
            {
                id: 40,
                name: 'Moonlit Terrace',
                description: 'King bed, private seating area, and evening glow.Unwind with space and style.',
                price: 44.99,
                isAvailable: true,
                Category: 'deluxe',
                imageUrl: 'https://res.cloudinary.com/dyxz9pqi0/image/upload/v1757166863/delux1_ydllck.png',
            },
            {
                id: 41,
                name: 'Golden Tide',
                description: 'Sun-kissed tones, corner sofa, and panoramic feel. A polished retreat for special stays.',
                price: 39.99,
                isAvailable: true,
                Category: 'deluxe',
                imageUrl: 'https://res.cloudinary.com/dyxz9pqi0/image/upload/v1757185495/Deluxe_Room_1920x950_yogvqm.webp',
            },
            {
                id: 42,
                name: 'Ivory Crest Suite',
                description: 'Refined neutrals, generous workspace, and plush seating. Designed for long, comfortable stays in cheer.',
                price: 49.99,
                isAvailable: true,
                Category: 'deluxe',
                imageUrl: 'https://res.cloudinary.com/dyxz9pqi0/image/upload/v1757185086/Deluxe_Room_t1kvo2.jpg',
            },
            {
                id: 43,
                name: 'Starlight Pavilion',
                description: 'Elegant canopy bed and curated lighting.Quiet luxury with room to breathe.',
                price: 42.99,
                isAvailable: true,
                Category: 'deluxe',
                imageUrl: 'https://res.cloudinary.com/dyxz9pqi0/image/upload/v1757185553/ethno-hotel-deluxe-sea-galeri2_winoyq.jpg',
            },
        ],
        skipDuplicates: true,
    })

    console.log('seeding done.')
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })