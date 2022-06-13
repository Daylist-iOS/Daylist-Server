import { Request, Response } from "express";
const functions = require('firebase-functions');
const db = require('../db/db');
const responseMessage = require("../constants/responseMessage");
const statusCode = require("../constants/statusCode");
const util = require("../lib/util");
const convertSnakeToCamel = require("../lib/convertSnakeToCamel");

/**
 *  @route POST /playlist
 *  @desc POST create playlist (데일리스트 생성)
 *  @access Private
 */

export default async (req: Request, res: Response) => {
    let fields = req.body.fields;
    let userId = fields['userId'];
    let thumbnailImage = req.body.imageUrls;

    if (!fields['userId'] || !fields['title'] || !fields['description'] || !fields['mediaLink'] || !fields['emotion'] || !thumbnailImage[0]) {
        res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, responseMessage.OUT_OF_VALUE));
        return;
    }

    const sql = `INSERT INTO playlist
                (user_id, title, description, thumbnail_image, media_link, emotion)
                VALUES
                (?, ?, ?, ?, ?, ?)
                `;

    const sql2 = `SELECT id as playlist_id, user_id, title, description, thumbnail_image, media_link, emotion, created_at FROM playlist where id = (SELECT max(id) FROM playlist) and user_id = ?`;

    try {
        db.getConnection((err: any, connection: any) => {
            if (err) throw err;
            connection.query(sql, [fields['userId'], fields['title'], fields['description'], thumbnailImage[0], fields['mediaLink'], fields['emotion'], fields['userId']], (err: any, result: any, fields: any) => {
                if(err) {
                    console.error("connectionPool GET Error");
                    res.status(statusCode.INTERNAL_SERVER_ERROR).send(util.fail(statusCode.INTERNAL_SERVER_ERROR, responseMessage.INTERNAL_SERVER_ERROR));
                } else {
                    connection.query(sql2, userId, (err: any, result: any, fields: any) => {
                        if(err) {
                            console.error("connectionPool GET Error");
                            res.status(statusCode.INTERNAL_SERVER_ERROR).send(util.fail(statusCode.INTERNAL_SERVER_ERROR, responseMessage.INTERNAL_SERVER_ERROR));
                        } else {
                            const queryResult = convertSnakeToCamel.keysToCamel(result[0]);
                            res.status(statusCode.OK).send(util.success(statusCode.OK, responseMessage.PLAYLIST_REGISTER_SUCCESS, queryResult));
                        }
                    });
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