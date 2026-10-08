const configPath = (brandName) => `config/${brandName}.json`;

export async function loadConfig(brandName) {
  const res = await fetch(configPath(brandName));
  if (!res.ok) {
    throw new Error(`Không tìm thấy file config: ${configPath(brandName)}`);
  }
  const config = await res.json();
  validateConfig(config);
  return config;
}

//yêu cầu file json phải có các key nàys
function validateConfig(config) {
  for (const key of ["brand", "theme"]) {
    if (!config[key]) {
      throw new Error(`File config thiếu trường bắt buộc: "${key}"`);
    }
  }
}
