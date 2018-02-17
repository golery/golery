FROM greensuisse/base
RUN sudo apt-get update
RUN apt-get install -y python python-pip
RUN pip install awscli --upgrade --user
RUN pip install awscli --upgrade pip
ENV PATH=~/.local/bin:$PATH
RUN aws --version