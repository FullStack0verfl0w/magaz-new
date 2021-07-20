import * as SQLite from 'expo-sqlite';
import { DATABASE_NAME, DATABASE_VERSION } from './config';

// Создаем соединение с бд
const db = SQLite.openDatabase(DATABASE_NAME, DATABASE_VERSION);

/**
 * Выполняет команду SQL
 * @param  {string} sql - инструкция SQL для выполнения
 * @param  {array} args - список значений для замены ? в инструкции
 * @param  {function} onSuccess - коллбэк при успешном выполнении команды
 * @param  {function} err - коллбэк при ошибке
 */
const executeSql = (sql, args, onSuccess, err) => {
	db.transaction((tr) => {
		tr.executeSql(sql, args, onSuccess, err);
	});
};

/**
 * Создаёт таблицы в бд
 */
export const createDBTables = () => {
	executeSql(`CREATE TABLE IF NOT EXISTS Images(
        imageLink TEXT UNIQUE,
        imageData TEXT)`, [], null, (tr, err) => console.log("SOMETHING WENT WRONG", err));
};

/**
 * Добавляет картинку в бд
 * @param {string} imageLink - ссылка на картинку
 * @param {string} imageData - картинка в формате base64
 */
export const addImageToDB = (imageLink, imageData) => {
	executeSql(`INSERT OR REPLACE INTO Images(
    	imageLink,
        imageData) VALUES(?, ?)`, [imageLink, imageData]);
};

/**
 * Запрашивает картинку из бд
 * @param {string} imageLink - ссылка на картинку
 * @param {function} cb - коллбэк при успешном выполнении
 * @param {function} err - коллбэк при ошибке
 */
export const getImageFromDB = (imageLink, cb, err) => {
	executeSql(`SELECT imageData, imageLink FROM Images WHERE imageLink='${imageLink}' LIMIT 1`, [], cb, err);
};