FROM ruby:3-bookworm
ENV LANG=C.UTF-8

# Install system dependencies
RUN rm -rf /var/lib/apt/lists/* && \
    apt-get clean && \
    apt-get update -qq && \
    apt-get install -y python3 build-essential curl webp \
    libxml2-dev libxslt-dev

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

# Install Bun dependencies including Tailwind CSS
ADD package.json /usr/src/app
ADD bun.lock /usr/src/app
RUN bun install --frozen-lockfile

#CMD jekyll serve --host 0.0.0.0 --incremental
CMD ["sh", "-c", "bun run build:css && (bun run watch:css & bundle exec jekyll serve --host 0.0.0.0 --incremental)"]

EXPOSE 4000
