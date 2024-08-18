import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

interface AuthRequest extends Request {
  token?: string;
  user?: any;
}
const auth = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const token = req.cookies.jwt;
    const verifyUser = jwt.verify(token, process.env.JWT_SECRET as string);
    console.log(verifyUser);
    const user = {};

    req.token = token;
    req.user = user;

    next();
  } catch (error) {
    res
      .status(401)
      .json({ message: "Unauthorised access", code: 401, data: null });
  }
};

export default auth;
