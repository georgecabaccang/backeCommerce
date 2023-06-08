import express from "express";
import { JwtPayload } from "jsonwebtoken";

declare global {
    namespace Express {
        interface Request {
            authenticatedUser: {
                email: string;
                _id: string;
                isSeller?: boolean;
            };
            config: {
                data: {
                    email?: string;
                    prod_id?: string;
                };
            };
        }
    }
}
