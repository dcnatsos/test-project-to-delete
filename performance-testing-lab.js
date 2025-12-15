import http from 'k6/http';
import { sleep, check } from 'k6';

// ---------------------------- Simple test with a single request (one iteration) ----------------------------
// export default () => {
//     // http.get('http://localhost:3000');
//     http.get('https://sgarden.issel.ee.auth.gr/');
// };



// ---------------------------- Load test targeting response time  ----------------------------
// Objective: Test system's behavior for an expected number of users

// export const options = {
//     stages: [
//         // The slope should be realistic, according to the system's expected traffic throughout the day
//         // Steeper slopes for stress/spike testing, gradual slopes for load/endurance testing.
//         { duration: '20s', target: 5000 }, //ramp up to 5000 users
//         { duration: '20s', target: 5000 }, // stable at 5000 users
//         { duration: '20s', target: 0 } // ramp down to 0 users        
//     ],
//     // To detect system degradation automatically we can set thresholds, that break the test the moment they are violated.
//     // Thresholds are based on the system's non-Functional Requirements.
//     thresholds: {
//         http_req_duration: ['p(95)<500'], // 95% of requests must complete within 500ms (does NOT break the execution when violated)
//         http_req_failed: [{ threshold: 'rate<0.001', abortOnFail: true }],  // Less than 1% requests should fail (BREAKS the experiment when violated)
//     }
// }

// export default () => {
//     // Simple get request
//     const resp = http.get('http://localhost:3000');

//     // We can also add checks regarding the responses, e.g. status, payload, etc.
//     check(resp, { 'Is status 200?': (r) => r.status === 200 }); // Check how many requests return 200
//     check(resp, { 'Is status 2xx?': (r) => Math.floor(r.status/100) === 2 }); // Check how many requests return 2xx
//     check(resp, { 'Is status 3xx?': (r) => Math.floor(r.status/100) === 3 }); // Check how many requests return 3xx
//     check(resp, { 'Is status 4xx?': (r) => Math.floor(r.status/100) === 4 }); // Check how many requests return 4xx
//     check(resp, { 'Is status 5xx?': (r) => Math.floor(r.status/100) === 5 }); // Check how many requests return 5xx

//     // Simulate realistic user behavior
//     sleep(Math.random() * 5); // Delay between [0, 5] seconds after each request (applies for each VU independently)
// }



// ---------------------------- Simple CI Test ----------------------------
// Objective: Quick smoke test for CI/CD pipeline

export const options = {
    stages: [
        { duration: '10s', target: 10 }, // Ramp up to 10 users
        { duration: '20s', target: 10 }, // Hold at 10 users
        { duration: '10s', target: 0 }, // Ramp down to 0 users
    ],
    thresholds: {
        http_req_failed: ['rate<0.01'], // Less than 1% of requests should fail
        http_req_duration: ['p(95)<500'], // 95% of requests must complete within 500ms
    },
}

export default () => {
    const resp = http.get('http://localhost:3000');
    check(resp, { 'Is status 200?': (r) => r.status === 200 });
    check(resp, { 'Is status 2xx?': (r) => Math.floor(r.status/100) === 2 });
    
    // Simulate think time between actions
    sleep(1);
}



// ---------------------------- Stress Test ----------------------------
// Objective: Find the system's breaking point

// export const options = {
//     // Use scenarios for more advanced exercises.
//     scenarios: {
//         gradual_ramp: {
//             executor: 'ramping-vus',
//             startVUs: 0, // Start with 0 virtual users
//             stages: [
//                 { duration: '10s', target: 5000 }, // Ramp up to 5000 users
//                 { duration: '40s', target: 5000 }, // Hold at 5000 users
//                 { duration: '10s', target: 10000 }, // Ramp up to 10000 users
//                 { duration: '40s', target: 10000 }, // Hold at 10000 users
//                 { duration: '10s', target: 15000 }, // Ramp up to 15000 users
//                 { duration: '40s', target: 15000 }, // Hold at 15000 users
//                 { duration: '10s', target: 20000 }, // Ramp up to 20000 users
//                 { duration: '40s', target: 20000 }, // Hold at 20000 users
//                 { duration: '10s', target: 0 }, // Ramp down to 0 users
//             ],
//             gracefulRampDown: '10s', // Wait for iterations to complete during ramp down (max 10s), else close the connections forcefully
//         },
//     },
//     thresholds: {
//         // http_req_failed: [{ threshold: 'rate<0.001', abortOnFail: true }],  // Error rate < 0.1% (abortOnFail: True stops the execution, once this threshold is violated))
//         // http_req_duration: [{ threshold: 'p(95)<500', abortOnFail: true }], // 95% of requests should complete in < 500ms
//         // http_req_duration: ['p(99)<1000'], // 99% of requests should complete in < 1000ms
//         // http_req_duration: ['max<2000'], // Maximum request duration < 2 seconds
//         // http_reqs: ['rate>100'], // At least 100 requests per second should be processed
//     },
// }

// export default () => {
//     const resp = http.get('http://localhost:3000');
//     check(resp, { 'Is status 200?': (r) => r.status === 200 });
//     check(resp, { 'Is status 2xx?': (r) => Math.floor(r.status/100) === 2 });
//     check(resp, { 'Is status 3xx?': (r) => Math.floor(r.status/100) === 3 });
//     check(resp, { 'Is status 4xx?': (r) => Math.floor(r.status/100) === 4 });
//     check(resp, { 'Is status 5xx?': (r) => Math.floor(r.status/100) === 5 }); // Δεν παίρνουμε 500, γιατί το σύστημα κλείνει το TCP connection

//     // Simulate think time between actions
//     sleep(Math.random() * 5);
// }



// ---------------------------- Spike test ----------------------------
// Objective: Test the system's ability to handle sudden surges in workload

// export const options = {
//     stages: [
//         { duration: '2m', target: 10000 }, // Ramp up to from 0 to 10000 users
//         { duration: '2m', target: 5000 }, // Ramp down from 10000 to 5000 users
//         { duration: '20m', target: 5000 }, // Hold at 5000 users to stabilize the system
//         { duration: '2m', target: 15000 }, // Ramp up from 5000 to 15000 users
//         { duration: '2m', target: 5000 }, // Ramp down from 15000 to 5000 users
//         { duration: '20m', target: 5000 }, // Hold at 5000 users to stabilize the system
//         { duration: '2m', target: 20000 }, // Ramp up from 5000 to 20000 users
//         { duration: '2m', target: 0 }, // Ramp down from 20000 to 0 users
//         // 20000 should be a little bit below the system's breaking point (found by stress test), so we stop here
//     ],
//     thresholds: {
//         // System's non-Functional Requirements
//         http_req_failed: [{ threshold: 'rate<0.001', abortOnFail: true }],  // Error rate < 0.1%
//         http_req_duration: [{ threshold: 'p(95)<500', abortOnFail: true }], // 95% of requests should complete in < 500ms
//         http_req_duration: ['p(99)<1000'], // 99% of requests should complete in < 1000ms
//         http_req_duration: ['max<2000'], // Maximum request duration < 2 seconds
//         http_reqs: ['rate>100'], // At least 100 requests per second should be processed (throughput)
//     },
// };

// export default () => {
//     const resp = http.get('http://localhost:3000');
//     sleep(Math.random() * 5); // Simulate think time between actions
// };



// ---------------------------- Endurance/Soak test ----------------------------
// Test system's ability to handle more than average loads for prolonged periods of time

// export const options = {
//     stages: [
//         { duration: '10m', target: 8000 }, // Ramp up to 8000 users (expected average load of our application)
//         { duration: '10h', target: 8000 }, // Hold at 8000 users for 10 hours
//         { duration: '10m', target: 0 }, // Ramp down to 0 users
//     ],
//     thresholds: {
//         // Thresholds based on the system's non-Functional Requirements
//         http_req_failed: [{ threshold: 'rate<0.001', abortOnFail: true }], // Error rate < 0.1%
//         http_req_duration: [{ threshold: 'p(95)<500', abortOnFail: true }], // 95% of requests should complete in < 500ms
//         http_req_duration: ['p(99)<1000'], // 99% of requests should complete in < 1000ms
//         http_req_duration: ['max<2000'], // Maximum request duration < 2 seconds
//         http_reqs: ['rate>100'], // At least 100 requests per second should be processed
//     },
// };

// export default () => {
//     const resp = http.get('http://localhost:3000');
//     check(resp, { 'Is status 200?': (r) => r.status === 200 });
//     sleep(Math.random() * 5); // Simulate think time between actions
// };