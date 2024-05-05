FROM ruby:3.3-bookworm
ENV LANG C.UTF-8
RUN apt-get update -qq && \
    apt-get install -y python3 build-essential
RUN mkdir /usr/src/app
WORKDIR /usr/src/app
ENV NOKOGIRI_USE_SYSTEM_LIBRARIES true
ADD Gemfile /usr/src/app
ADD Gemfile.lock /usr/src/app
RUN gem install bundle && \
    bundle && \
    bundle install
CMD jekyll serve --host 0.0.0.0 --incremental
