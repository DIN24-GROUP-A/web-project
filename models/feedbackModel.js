const mysql = require("mysql");
const db = mysql.createConnection({
	host: process.env.DATABASE_HOST,
	user: process.env.DATABASE_USER,
	password: process.env.DATABASE_PASSWORD,
	database: process.env.DATABASE,
	port: process.env.PORT,
});

// Get all feedback entries
const getAll = async () => {
	const [rows] = await db.query(
		"SELECT f.*, u.name FROM feedback f JOIN users u ON f.user_id = u.id ORDER BY f.created_at DESC"
	);
	return rows;
};

// Get a specific feedback entry by ID
const getById = async (id, userId) => {
	const [rows] = await db.query("SELECT * FROM feedback WHERE id = ? AND user_id = ?", [id, userId]);
	return rows[0];
};

// Add new feedback
const add = async (userId, topic, message, isABug) => {
	const [result] = await db.query("INSERT INTO feedback (user_id, topic, message, isABug) VALUES (?, ?, ?, ?)", [
		userId,
		topic,
		message,
		isABug,
	]);
	return result.insertId;
};

// Update feedback resolution status
const updateResolution = async (id, userId, resolved) => {
	const [result] = await db.query("UPDATE feedback SET resolved = ? WHERE id = ? AND user_id = ?", [
		resolved,
		id,
		userId,
	]);
	return result.affectedRows;
};

// Remove feedback entry
const remove = async (id, userId) => {
	const [result] = await db.query("DELETE FROM feedback WHERE id = ? AND user_id = ?", [id, userId]);
	return result.affectedRows;
};

// Export functions
module.exports = {
	getAll,
	getById,
	add,
	updateResolution,
	remove,
};
