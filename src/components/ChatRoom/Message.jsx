import React from 'react';
import { Avatar, Typography } from 'antd';
import styled from 'styled-components';
import { formatRelative } from 'date-fns/esm';

const WrapperStyled = styled.div`
  margin-bottom: 10px;

  .author {
    margin-left: 5px;
    font-weight: bold;
  }

  .date {
    margin-left: 10px;
    font-size: 11px;
    color: #a7a7a7;
  }

  .content {
    margin-left: 30px;
  }
`;

function formatDate(seconds) {
  let formattedDate = '';

  if (seconds) {
    formattedDate = formatRelative(new Date(seconds * 1000), new Date());

    formattedDate =
      formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);
  }

  return formattedDate;
}

export default function Message({ content, displayName, createdAt, photoURL }) {
  var date = new Date(createdAt);
  var dateFormat = date.getDate() + '/' + date.getMonth() + '/' + date.getFullYear()
                  + ' - ' + date.getHours() + ':' + date.getMinutes();
  return (
    <WrapperStyled>
      <div>
        <Avatar size='small' src={photoURL}>
          {photoURL ? '' : displayName?.charAt(0)?.toUpperCase()}
        </Avatar>
        <Typography.Text className='author'>{displayName}</Typography.Text>
        <Typography.Text className='date'>
          {dateFormat}
        </Typography.Text>
      </div>
      <div>
        <Typography.Text className='content'>{content}</Typography.Text>
      </div>
    </WrapperStyled>
  );
}
