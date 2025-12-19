import fs from 'fs/promises';
import path from 'path';

const DATA_FILE = path.join(process.cwd(), 'data', 'products.json');

// Helper to ensure data directory exists
async function ensureDataDir() {
    const dir = path.dirname(DATA_FILE);
    try {
        await fs.access(dir);
    } catch {
        await fs.mkdir(dir, { recursive: true });
    }
}

export async function getProducts() {
    await ensureDataDir();
    try {
        const data = await fs.readFile(DATA_FILE, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        return [];
    }
}

// Saves a single product by appending (legacy support) OR overwrites if array passed
export async function saveProduct(productOrProducts: any) {
    await ensureDataDir();
    
    if (Array.isArray(productOrProducts)) {
        // Overwrite entire file (for deletions/updates)
        await fs.writeFile(DATA_FILE, JSON.stringify(productOrProducts, null, 2));
        return productOrProducts;
    } else {
        // Append single product
        const products = await getProducts();
        products.push(productOrProducts);
        await fs.writeFile(DATA_FILE, JSON.stringify(products, null, 2));
        return productOrProducts;
    }
}
