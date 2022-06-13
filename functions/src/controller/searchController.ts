import { Request, Response } from "express";
const functions = require('firebase-functions');
const db = require('../db/db');
const responseMessage = require("../constants/responseMessage");
const statusCode = require("../constants/statusCode");
const util = require("../lib/util");
const convertSnakeToCamel = require("../lib/convertSnakeToCamel");

/**
 *  @route POST /search/:userId
 *  @desc POST search with Keyword (키워드 기반 FTS 자연어 유사 검색)
 *  @access Private
 */
export default async (req: Request, res: Response) => {
    const userId = req.params.userId;
    const keyword = req.body.keyword;

    const sql = "select id as playlist_id, user_id, title, description, thumbnail_image, media_link, emotion, created_at from playlist where user_id = ? and is_deleted = 0 and match(title, description) AGAINST(?)";
    
    try {
        db.getConnection((err: any, connection: any) => {
            if (err) throw err;
            connection.query(sql, [userId, keyword], (err: any, result: any, fields: any) => {
                if(err) {
                    console.error("connectionPool GET Error");
                    res.status(statusCode.INTERNAL_SERVER_ERROR).send(util.fail(statusCode.INTERNAL_SERVER_ERROR, responseMessage.INTERNAL_SERVER_ERROR));
                } else {
                    const queryResult = convertSnakeToCamel.keysToCamel(result);
                    res.status(statusCode.OK).send(util.success(statusCode.OK, responseMessage.SEARCH_SUCCESS, queryResult));
                }
            })
            connection.release();
        })
    } catch (error) {
        functions.logger.error(`[ERROR] [${req.method.toUpperCase()}] ${req.originalUrl}`, `[CONTENT] ${error}`);
        console.log(error);
        res.status(statusCode.INTERNAL_SERVER_ERROR).send(util.fail(statusCode.INTERNAL_SERVER_ERROR, responseMessage.INTERNAL_SERVER_ERROR));
    } 
}; 