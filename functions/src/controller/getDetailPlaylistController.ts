import { Request, Response } from "express";
const functions = require('firebase-functions');
const db = require('../db/db');
const responseMessage = require("../constants/responseMessage");
const statusCode = require("../constants/statusCode");
const util = require("../lib/util");
const convertSnakeToCamel = require("../lib/convertSnakeToCamel");

/**
 *  @route GET /playlist/:userId/:playlistId
 *  @desc GET detail Playlist (플레이리스트 상세조회)
 *  @access Private
 */
export default async (req: Request, res: Response) => {
    const userId = req.params.userId;
    const playlistId = req.params.playlistId;

    const sql = "select id as playlist_id, user_id, title, description, thumbnail_image, media_link, emotion, created_at from playlist where id = ? and user_id = ?";

    try {
        db.getConnection((err: any, connection: any) => {
            if (err) throw err;
            connection.query(sql, [playlistId, userId], (err: any, result: any, fields: any) => {
                if(err) {
                    console.error("connectionPool GET Error");
                    res.status(statusCode.INTERNAL_SERVER_ERROR).send(util.fail(statusCode.INTERNAL_SERVER_ERROR, responseMessage.INTERNAL_SERVER_ERROR));
                } else {
                    const queryResult = convertSnakeToCamel.keysToCamel(result[0]);
                    res.status(statusCode.OK).send(util.success(statusCode.OK, responseMessage.PLAYLIST_DETAIL_READ_SUCCESS, queryResult));
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