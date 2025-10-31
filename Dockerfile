# Step 1: Use a lightweight Nginx image as the base
FROM nginx:alpine

# Step 2: Set the working directory to the Nginx web root
WORKDIR /usr/share/nginx/html

# Step 3: Remove the default Nginx content
RUN rm -rf ./*

# Step 4: Copy all application files to the working directory
COPY . .

# Step 5: Copy the entrypoint script
COPY entrypoint.sh /entrypoint.sh
# or COPY entrypoint.sh /usr/local/bin/entrypoint.sh  -- More standard location
# Step 6: Grant execute permissions to the entrypoint script
RUN chmod +x /entrypoint.sh

# Step 7: Set the entrypoint to our custom script
ENTRYPOINT ["/entrypoint.sh"]

# Step 8: The command to run after the entrypoint script finishes.
# This starts the Nginx server in the foreground.
CMD ["nginx", "-g", "daemon off;"]
