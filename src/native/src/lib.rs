#![deny(clippy::all)]

use napi_derive::napi;

#[napi]
pub fn hello_rust() -> String {
  "Hello from Rust Native Worker!".to_string()
}

#[napi]
pub struct NativeWorker {
  pub pool_size: u32,
}

#[napi]
impl NativeWorker {
  #[napi(constructor)]
  pub fn new(pool_size: Option<u32>) -> Self {
    NativeWorker {
      pool_size: pool_size.unwrap_or(4),
    }
  }

  #[napi]
  pub fn transform_sync(&self, code: String, _id: String) -> String {
    // Simulate transformation
    format!("/* Native Transformed */\n{}", code)
  }

  #[napi]
  pub async fn transform(&self, code: String, _id: String) -> String {
    // Simulate async transformation
    format!("/* Async Native Transformed */\n{}", code)
  }
}

#[napi]
pub fn benchmark_transform(code: String, iterations: u32) -> u32 {
  let start = std::time::Instant::now();
  for _ in 0..iterations {
    let _ = format!("/* Bench */\n{}", code);
  }
  start.elapsed().as_millis() as u32
}
