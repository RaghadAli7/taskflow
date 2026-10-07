<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Task;
use App\Models\User;
use Illuminate\Database\Seeder;

class TaskSeeder extends Seeder
{
    public function run(): void
    {
        $user = User::first();

        if (!$user) {
            return;
        }

        $categories = Category::where('user_id', $user->id)->get();

        $tasks = [
            // Urgent & High Priority
            [
                'title' => 'Fix critical bug in production',
                'description' => 'Users cannot log in due to session error. Must be fixed ASAP.',
                'status' => 'in_progress',
                'priority' => 'high',
                'due_date' => now()->addHours(4),
                'category' => 'Urgent',
            ],
            [
                'title' => 'Prepare client presentation',
                'description' => 'Slides for tomorrow\'s meeting with the German client.',
                'status' => 'pending',
                'priority' => 'high',
                'due_date' => now()->addDays(1),
                'category' => 'Work',
            ],
            [
                'title' => 'Submit tax documents',
                'description' => 'Send all tax documents to the accountant before deadline.',
                'status' => 'pending',
                'priority' => 'high',
                'due_date' => now()->subDays(2), // Overdue!
                'category' => 'Urgent',
            ],

            // Work tasks
            [
                'title' => 'Review pull requests',
                'description' => 'Review 5 open PRs on the GitHub repository.',
                'status' => 'pending',
                'priority' => 'medium',
                'due_date' => now()->addDays(2),
                'category' => 'Work',
            ],
            [
                'title' => 'Update project documentation',
                'description' => 'Update README and API docs with new endpoints.',
                'status' => 'in_progress',
                'priority' => 'medium',
                'due_date' => now()->addDays(3),
                'category' => 'Work',
            ],
            [
                'title' => 'Team standup meeting',
                'description' => 'Daily 15-minute standup with the development team.',
                'status' => 'completed',
                'priority' => 'medium',
                'due_date' => now()->subHours(2),
                'category' => 'Work',
            ],
            [
                'title' => 'Write weekly report',
                'description' => 'Summarize this week\'s progress and next week\'s plans.',
                'status' => 'completed',
                'priority' => 'low',
                'due_date' => now()->subDays(1),
                'category' => 'Work',
            ],

            // Personal tasks
            [
                'title' => 'Book dentist appointment',
                'description' => 'Regular checkup every 6 months.',
                'status' => 'pending',
                'priority' => 'medium',
                'due_date' => now()->addDays(5),
                'category' => 'Health',
            ],
            [
                'title' => 'Buy groceries',
                'description' => 'Milk, eggs, bread, vegetables, fruits, and coffee.',
                'status' => 'pending',
                'priority' => 'low',
                'due_date' => now()->addDays(1),
                'category' => 'Shopping',
            ],
            [
                'title' => 'Pay electricity bill',
                'description' => 'Monthly bill from the electricity company.',
                'status' => 'completed',
                'priority' => 'high',
                'due_date' => now()->subDays(3),
                'category' => 'Personal',
            ],
            [
                'title' => 'Call mom',
                'description' => 'Weekly call to check on family.',
                'status' => 'completed',
                'priority' => 'medium',
                'due_date' => now()->subDays(1),
                'category' => 'Personal',
            ],

            // Study tasks
            [
                'title' => 'Complete Laravel course',
                'description' => 'Finish chapters 8-12 of the advanced Laravel course.',
                'status' => 'in_progress',
                'priority' => 'medium',
                'due_date' => now()->addDays(7),
                'category' => 'Study',
            ],
            [
                'title' => 'Practice German vocabulary',
                'description' => 'Learn 50 new German words this week.',
                'status' => 'in_progress',
                'priority' => 'medium',
                'due_date' => now()->addDays(4),
                'category' => 'Study',
            ],
            [
                'title' => 'Read "Clean Code" book',
                'description' => 'Read chapters 5-8.',
                'status' => 'pending',
                'priority' => 'low',
                'due_date' => now()->addDays(10),
                'category' => 'Study',
            ],

            // Future tasks
            [
                'title' => 'Plan summer vacation',
                'description' => 'Research destinations and book flights.',
                'status' => 'pending',
                'priority' => 'low',
                'due_date' => now()->addDays(30),
                'category' => 'Personal',
            ],
            [
                'title' => 'Renew gym membership',
                'description' => 'Annual membership expires next month.',
                'status' => 'pending',
                'priority' => 'low',
                'due_date' => now()->addDays(15),
                'category' => 'Health',
            ],
        ];

        foreach ($tasks as $taskData) {
            $category = $categories->firstWhere('name', $taskData['category']);

            Task::create([
                'user_id' => $user->id,
                'category_id' => $category?->id,
                'title' => $taskData['title'],
                'description' => $taskData['description'],
                'status' => $taskData['status'],
                'priority' => $taskData['priority'],
                'due_date' => $taskData['due_date'],
                'completed_at' => $taskData['status'] === 'completed' ? now() : null,
            ]);
        }
    }
}