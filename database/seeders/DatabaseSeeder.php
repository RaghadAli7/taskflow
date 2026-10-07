<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // Create test user if not exists
        $user = User::firstOrCreate(
            ['email' => 'test@taskflow.com'],
            [
                'name' => 'Test User',
                'password' => Hash::make('password'),
                'email_verified_at' => now(),
            ]
        );

        $this->command->info('✅ Test user created: test@taskflow.com / password');

        // Seed categories and tasks
        $this->call([
            CategorySeeder::class,
            TaskSeeder::class,
        ]);

        $this->command->info('✅ Categories and tasks seeded successfully!');
    }
}