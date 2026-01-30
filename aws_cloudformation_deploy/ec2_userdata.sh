#!/bin/bash

# Exit immediately if a command exits with a non-zero status
set -e

# Update system
apt-get update -y
apt-get upgrade -y

# Install Nginx and Git
apt-get install -y nginx git

# Enable and start Nginx
systemctl start nginx
systemctl enable nginx

# Remove default Nginx site content
rm -rf /var/www/html/*

# Clone your GitHub repository
cd /var/www/html
git clone https://github.com/InfX2243/moodly.git

# Move website files to web root
cp -r moodly/* /var/www/html/

# Fix permissions
chown -R www-data:www-data /var/www/html
chmod -R 755 /var/www/html

# Restart Nginx
systemctl restart nginx