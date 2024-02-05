import axios from "axios";
import { firstLustDays } from "./time";

const instance = axios.create({
  baseURL: "https://isu.tisbi.ru/api",
});

/**
 * getting token
 * @param {string} login user login
 * @param {string} password user password
 * @returns {Promise}
 */

export async function getToken(login: string, password: string): Promise<any> {
  return await instance({
    url: "/security/login",
    method: "POST",
    data: { login, password },
  })
    .then((res) => res.data.token)
    .catch((e) => Promise.reject(e));
}

/**
 * getting role-list
 * @param {string} token user token
 * @returns {Promise}
 */

export async function getRoleList(token: string): Promise<any> {
  return await instance({
    url: "/security/role-list",
    method: "GET",
    headers: { token },
  })
    .then((res) => res.data.list)
    .catch((e) => Promise.reject(e));
}

/**
 * getting role info
 * @param {string} token user token
 * @param {string} peopleRoleId role id
 * @returns
 */

export async function getRoleInfo(token: string, peopleRoleId: string) {
  return await instance({
    url: "/security/role-use",
    method: "POST",
    data: { peopleRoleId },
    headers: {
      token: token,
    },
  })
    .then((res) => res.data.token)
    .catch((e) => Promise.reject(e));
}

/**
 * getting user hash
 * @param {string} token user token
 * @param {string} path role id
 * @returns
 */

export async function getHash(token: string, path: string) {
  return await instance({
    url: `/area/user/${path}`,
    method: "GET",
    headers: {
      token: token,
    },
  })
    .then((res) => {
      if (path === "teacher/" || path === "student/") return res.data;
      else {
        throw new Error("Неподходящая роль");
      }
    })
    .catch((e) => Promise.reject(e));
}

/**
 * getting user hash
 * @param {string} token user token
 * @param {string} hash student hash
 * @param {string} date date
 * @returns
 */

export async function getSchedule(
  token: string,
  hash: string,
  date: string,
  role: string
) {
  let currRole = "stud";
  if (role === "Преподаватель") {
    currRole = "staff";
  }

  const [startDate, endDate] = firstLustDays(new Date(date));
  return await instance({
    url: `/module/edu-schedule/${hash}/${currRole}?startDate=${startDate}&endDate=${endDate}`,
    method: "GET",
    headers: {
      token: token,
    },
  })
    .then((res) => res.data)
    .catch((e) => Promise.reject(e));
}

/**
 * getting online lesson link
 * @param {string} hash student hash
 * @param {string} extId lesson id
 * @param {string} token user token
 * @returns
 */

export async function getScheduleLink(
  hash: string,
  extId: string,
  token: string
) {
  return await instance({
    url: `/module/edu-schedule/${hash}/${extId}`,
    method: "GET",
    headers: {
      token: token,
    },
  })
    .then((res) => res.data)
    .catch((e) => Promise.reject(e));
}


/**
 * getting online lesson
 * @param {string} token user token
 * @returns
 */

export async function getOnlineSchedule(
  token: string
) {
  return await instance({
    url: `/module/sched-lesson/`,
    method: "GET",
    headers: {
      token: token,
    },
  })
    .then((res) => res.data)
    .catch((e) => Promise.reject(e));
}


/**
 * getting online lesson
 * @param {string} hash lesson hash
 * @param {string} token user token
 * @returns
 */

export async function getOnlineScheduleLink(
  hash:string,
  token: string
) {
  return await instance({
    url: `/module/sched-lesson/${hash}/enter`,
    method: "GET",
    headers: {
      token: token,
    },
  })
    .then((res) => res.data)
    .catch((e) => Promise.reject(e));
}