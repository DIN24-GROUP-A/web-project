const mysql = require("mysql");
const db = mysql.createConnection({
	host: process.env.DATABASE_HOST,
	user: process.env.DATABASE_USER,
	password: process.env.DATABASE_PASSWORD,
	database: process.env.DATABASE,
	port: process.env.PORT,
});

// Get all calculations
const getAll = async (userId) => {
	const [rows] = await db.query("SELECT * FROM calculations WHERE user_id = ? ORDER BY created_at DESC", [userId]);
	return rows;
};

// Get one calculation
const getById = async (id, userId) => {
	const [rows] = await db.query("SELECT * FROM calculations WHERE id = ? AND user_id = ?", [id, userId]);
	return rows[0];
};

const create = async (name, data, userId) => {
	const [result] = await db.query("INSERT INTO calculations (name, data, user_id) VALUES (?, ?, ?)", [
		name,
		data,
		userId,
	]);
	return result.insertId;
};

const update = async (id, name, data, userId) => {
	const [result] = await db.query("UPDATE calculations SET name = ?, data = ? WHERE id = ? AND user_id = ?", [
		name,
		data,
		id,
		userId,
	]);
	return result.affectedRows;
};

const remove = async (id, userId) => {
	const [result] = await db.query("DELETE FROM calculations WHERE id = ? AND user_id = ?", [id, userId]);
	return result.affectedRows;
};

module.exports = {
	getAll,
	getById,
	create,
	update,
	remove,
};
