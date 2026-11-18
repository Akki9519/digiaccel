const BASE_URL = 'http://localhost:5000/api';

async function runTests() {
  console.log('--- Starting Comprehensive API & Flow Verification ---');
  let passed = 0;
  let failed = 0;

  async function test(name, fn) {
    try {
      await fn();
      console.log(`[PASS] ${name}`);
      passed++;
    } catch (e) {
      console.error(`[FAIL] ${name}: ${e.message}`);
      failed++;
    }
  }

  let createdTaskId = null;

  // 1. Health check
  await test('Server Health Check', async () => {
    const res = await fetch(`${BASE_URL}/health`);
    const data = await res.json();
    if (!res.ok || data.status !== 'ok') throw new Error('Health check failed');
  });

  // 2. Create Task
  await test('Create Task with Mandatory & Optional fields', async () => {
    const taskPayload = {
      title: 'Automated E2E Test Task',
      description: 'Testing weekly grouping and swipe-to-delete',
      dateTime: new Date().toISOString(),
      priority: 'High',
      status: 'In Progress',
    };
    const res = await fetch(`${BASE_URL}/tasks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(taskPayload),
    });
    const data = await res.json();
    if (!res.ok || !data.success || !data.data._id) {
      throw new Error(`Create task failed: ${JSON.stringify(data)}`);
    }
    createdTaskId = data.data._id;
  });

  // 3. Validation: Missing title or date
  await test('Validation rejects task without title', async () => {
    const res = await fetch(`${BASE_URL}/tasks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ dateTime: new Date().toISOString() }),
    });
    if (res.status !== 400) throw new Error('Expected 400 Bad Request');
  });

  // 4. Weekly Grouping Verification
  await test('Weekly Grouping includes new task in Monday-Sunday range', async () => {
    const res = await fetch(`${BASE_URL}/tasks/weekly`);
    const data = await res.json();
    if (!res.ok || !data.data || !Array.isArray(data.data.weeks)) {
      throw new Error('Weekly tasks query failed');
    }

    const foundInWeeks = data.data.weeks.some((w) =>
      w.tasks.some((t) => t._id === createdTaskId)
    );
    if (!foundInWeeks) throw new Error('Created task not found in any week group');

    console.log(`       Verified total active weeks: ${data.data.weeks.length}`);
    console.log(`       Global summary: Open=${data.data.summary.totalOpen}, Closed=${data.data.summary.totalCompleted}`);
  });

  // 5. Update Task Attributes (Edit Task)
  await test('Edit Task (Update Title, Priority, Description)', async () => {
    const res = await fetch(`${BASE_URL}/tasks/${createdTaskId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: 'Updated E2E Test Task Title',
        priority: 'Low',
        description: 'Updated Description Content',
      }),
    });
    const data = await res.json();
    if (!res.ok || data.data.title !== 'Updated E2E Test Task Title' || data.data.priority !== 'Low') {
      throw new Error('Task update failed');
    }
  });

  // 6. Search Functionality
  await test('Search Task by Keyword in Title or Description', async () => {
    const res = await fetch(`${BASE_URL}/tasks?search=Updated%20E2E`);
    const data = await res.json();
    if (!res.ok || data.data.length === 0) {
      throw new Error('Search did not return expected task');
    }
    if (data.data[0]._id !== createdTaskId) {
      throw new Error('Search returned wrong task');
    }
  });

  // 7. Status Toggle (In Progress -> Completed)
  await test('Update Task Status to Completed and recalculate metrics', async () => {
    const res = await fetch(`${BASE_URL}/tasks/${createdTaskId}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'Completed' }),
    });
    const data = await res.json();
    if (!res.ok || data.data.status !== 'Completed') {
      throw new Error('Status update to Completed failed');
    }

    // Verify weekly metrics reflect the change
    const weeklyRes = await fetch(`${BASE_URL}/tasks/weekly`);
    const weeklyData = await weeklyRes.json();
    const targetWeek = weeklyData.data.weeks.find((w) =>
      w.tasks.some((t) => t._id === createdTaskId)
    );
    if (!targetWeek) throw new Error('Week not found');
    const targetTask = targetWeek.tasks.find((t) => t._id === createdTaskId);
    if (targetTask.status !== 'Completed') throw new Error('Status not reflected in weekly group');
  });

  // 8. Delete Task
  await test('Delete Task', async () => {
    const res = await fetch(`${BASE_URL}/tasks/${createdTaskId}`, {
      method: 'DELETE',
    });
    const data = await res.json();
    if (!res.ok || !data.success) throw new Error('Delete task failed');

    // Confirm it cannot be fetched
    const checkRes = await fetch(`${BASE_URL}/tasks/${createdTaskId}`);
    if (checkRes.status !== 404) throw new Error('Task still exists after deletion');
  });

  console.log(`\n--- Verification Summary: ${passed} Passed, ${failed} Failed ---`);
  if (failed > 0) process.exit(1);
}

runTests();
