FROM ruby:3-bookworm
ENV LANG=C.UTF-8

# Install system dependencies
RUN rm -rf /var/lib/apt/lists/* && \
    apt-get clean && \
    apt-get update -qq && \
    apt-get install -y python3 build-essential curl webp \
    libxml2-dev libxslt-dev watchman

# Install Bun
RUN curl -fsSL https://bun.sh/install | bash
ENV PATH="/root/.bun/bin:$PATH"

RUN mkdir /usr/src/app
WORKDIR /usr/src/app

ENV NOKOGIRI_USE_SYSTEM_LIBRARIES=true

# Install Ruby dependencies
ADD Gemfile /usr/src/app
ADD Gemfile.lock /usr/src/app
RUN gem install bundle && \
    bundle install

# Install Bun dependencies including Tailwind CSS to a separate location
ADD package.json /usr/local/bun-deps/
ADD bun.lock /usr/local/bun-deps/
WORKDIR /usr/local/bun-deps
RUN bun install --frozen-lockfile

# Add the installed binaries to PATH and set NODE_PATH for module resolution
ENV PATH="/usr/local/bun-deps/node_modules/.bin:$PATH"
ENV NODE_PATH="/usr/local/bun-deps/node_modules"

# Switch back to app directory
WORKDIR /usr/src/app

#CMD jekyll serve --host 0.0.0.0 --incremental
CMD ["sh", "-c", "bun run build:css && (bun run watch:css & bundle exec jekyll serve --host 0.0.0.0 --incremental)"]

EXPOSE 4000
