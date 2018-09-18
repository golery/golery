#docker build -t greensuisse/aws .

FROM greensuisse/ubuntu
RUN apt-get install -y python python-pip
RUN pip install --upgrade pip
RUN pip install awscli --upgrade --user
ENV PATH=~/.local/bin:$PATH
CMD bash