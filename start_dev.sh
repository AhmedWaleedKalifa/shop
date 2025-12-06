#!/bin/bash

echo "Starting all development environments..."

# Get the absolute path of the directory where this script is located
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"

open_tab() {
    gnome-terminal --tab --title="$1" --working-directory="$2" -- bash -c "$3; exec bash"
}
# Open visual studio
open_tab "code" "$SCRIPT_DIR" "cd ../ && code shop; exit"

# Open google
open_tab "google" "$SCRIPT_DIR" " bg google-chrome; exit"

# Open postman
open_tab "postman" "$SCRIPT_DIR" " bg postman; exit"


# Backend
open_tab "Backend1" "$SCRIPT_DIR/back-end" "npm run dev"

open_tab "Backend2" "$SCRIPT_DIR/back-end" "echo backend"
# Prisma
open_tab "Prisma" "$SCRIPT_DIR/back-end" "npx prisma studio"

# Frontend
open_tab "Frontend1" "$SCRIPT_DIR/front-end/main-app" "npm run dev"
open_tab "Frontend2" "$SCRIPT_DIR/front-end/main-app"  "echo main app"

open_tab "Frontend2" "$SCRIPT_DIR/front-end/admin-port"  "npm run dev"
open_tab "Frontend2" "$SCRIPT_DIR/front-end/admin-port"  "echo admin portal"


echo "All development environments started!"
