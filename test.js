import http from "k6/http";
import { check, sleep } from "k6";

export const options = {
  stages: [
    { duration: "30s", target: 300 },
    { duration: "30s", target: 500 },
    { duration: "5ms", target: 1000 },
    { duration: "20s", target: 0 },
  ],
  thresholds: {
    http_req_duration: ['avg<500'],
    checks: ['rate>0.99']
  }
};

export default function () {
  const username = "LoadTest";
  const password = "loadpassword"
  const email = "load@mail.com"


  const post = http.get("http://20.113.55.136/posts/api/posts");
  check(post, {
    "status was 200": (r) => r.status === 200,
  });
  sleep(1);

  // const res = http.get("http://20.113.55.136/users/api/test/all");
  // check(res, {
  //   "status was 200": (r) => r.status === 200,
  // });
  // sleep(1);

  // const user = http.get("http://20.113.55.136/users/api/test/user");
  // check(user, {
  //   "status was 403": (r) => r.status === 403,
  // });
  // sleep(1);

  // const mod = http.get("http://20.113.55.136/users/api/test/mod");
  // check(mod, {
  //   "status was 403": (r) => r.status === 403,
  // });
  // sleep(1);

  // const admin = http.get("http://20.113.55.136/users/api/test/admin");
  // check(admin, {
  //   "status was 403": (r) => r.status === 403,
  // });
  // sleep(1);


  // const register = http.post("http://20.113.55.136/users/api/auth/signup", { username: username, password: password, email: email})
  // check(register, {
  //   "status was 400": (r) => r.status === 400,
  // })


  // const login = http.post("http://20.113.55.136/users/api/auth/signin", { username: username, password: password})
  // check(login, {
  //   "status was 200": (r) => r.status === 200,
  // })
}