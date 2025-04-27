# Use the official Node image as the base image, specifying Node 20
FROM node:20

# Install necessary system dependencies for native modules
RUN apt-get update && apt-get install -y \
    build-essential \
    python3 \
    libvips \
    libvips-dev \
    libcairo2-dev \
    libpango1.0-dev \
    libjpeg-dev \
    libgif-dev \
    librsvg2-dev \
    chromium \
    libgbm-dev \
    wget \
    gnupg \
    ca-certificates \
    fonts-liberation \
    libasound2 \
    libatk-bridge2.0-0 \
    libatspi2.0-0 \
    libdrm2 \
    libxcomposite1 \
    libxdamage1 \
    libxfixes3 \
    libxrandr2 \
    libgbm1 \
    libgtk-3-0 \
    libnss3 \
    libxshmfence1 \
    xdg-utils \
    && rm -rf /var/lib/apt/lists/*

# Enable Corepack to manage Yarn versions
RUN corepack enable

# Set the working directory in the container
WORKDIR /app

# Copy Yarn configuration files
COPY package.json yarn.lock .yarnrc.yml ./

# Install all workspace dependencies from the root
RUN corepack prepare yarn@3.6.1 --activate
RUN yarn install

# Copy the entire application to the Docker image
COPY . .

RUN yarn install || true
# Navigate to the specific plugin directory and install its dependencies
WORKDIR /app/packages/silvergenieCMS/src/plugins/silvergenie
RUN npm install --ignore-engines

# Return to the silvergenieCMS  directory
WORKDIR /app/packages/silvergenieCMS

# Build the Strapi project 
RUN NODE_ENV='production' yarn build 

# Set the final working directory to the root of your application
WORKDIR /app

# Expose the port Strapi runs on
EXPOSE 1337

# Command to run your app using Yarn
CMD ["yarn", "cms:prod"]