function expected_mb_usage(patterns_length) {
  const min_kb = 5;
  const max_kb = 30;

  const min_mem_mb = ((min_kb * patterns_length) / 1000).toFixed(2);
  const max_mem_mb = ((max_kb * patterns_length) / 1000).toFixed(2);

  return [min_mem_mb, max_mem_mb];
}

function log_info(start_after, patterns_length) {
  const [mem_usage_min, mem_usage_max] = expected_mb_usage(patterns_length);
  // Show infos...
  console.log("🏁 Starting in ", start_after / 1000, " seconds...");
  console.log("🗾 Number of Png to download: ", patterns_length);
  console.log(
    "💿 Mem usage will be in range: [",
    mem_usage_min,
    "-",
    mem_usage_max,
    "] Mb\n"
  );
}

module.exports = { log_info };
