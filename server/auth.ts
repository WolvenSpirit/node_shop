import bcryptjs from "bcryptjs";

export function hash(plain: string): string {
    return bcryptjs.hashSync(plain, 11);
}

export function compare(plain: string, h: string): boolean {
    return bcryptjs.compareSync(plain,h);
}
