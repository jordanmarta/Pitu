import { Sequelize } from "sequelize";

const sequelize = new Sequelize('mysql://root:12102013@localhost:3306/pitu');

export default sequelize;