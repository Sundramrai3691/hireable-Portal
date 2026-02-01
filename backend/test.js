const { supabase } = require('./config/supabase');

async function testDatabase() {
  console.log('Testing database connection...\n');

  console.log('1. Testing users table...');
  const { data: users, error: usersError } = await supabase
    .from('users')
    .select('count');

  if (usersError) {
    console.log('   Error:', usersError.message);
  } else {
    console.log('   ✓ Users table accessible');
  }

  console.log('\n2. Testing jobs table...');
  const { data: jobs, error: jobsError } = await supabase
    .from('jobs')
    .select('count');

  if (jobsError) {
    console.log('   Error:', jobsError.message);
  } else {
    console.log('   ✓ Jobs table accessible');
  }

  console.log('\n3. Testing applications table...');
  const { data: apps, error: appsError } = await supabase
    .from('applications')
    .select('count');

  if (appsError) {
    console.log('   Error:', appsError.message);
  } else {
    console.log('   ✓ Applications table accessible');
  }

  console.log('\nDatabase test complete!');
}

testDatabase().catch(console.error);
