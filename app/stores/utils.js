import { DateTime } from 'luxon';

const nowAsString = () => DateTime.now().toSQL();

const sqlDateToJsDate = (sqlDate) => DateTime.fromSQL(sqlDate).toJSDate();

export { nowAsString, sqlDateToJsDate };