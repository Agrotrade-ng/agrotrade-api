import { Request, Response } from 'express';

export class ProductController {
    private service;

    constructor() {
        // this.service =
    }

    //
    handleFetchAllProducts = async (req: Request, res: Response) => {};

    handleFetchSingleProduct = async (req: Request, res: Response) => {};

    handleCreateProduct = async (req: Request, res: Response) => {};

    handleDeleteProduct = async (req: Request, res: Response) => {};
}
