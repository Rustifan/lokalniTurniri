import React from 'react'
import { Link } from 'react-router-dom'
import { Card, Image } from 'semantic-ui-react'
import { userIcon } from '../../App/Core/Constants'
import { UserProfile } from '../../App/Interfaces/UserProfile'

interface Props
{
    profile: UserProfile;
}

const UserCard = ({profile}: Props) => (
  <Card as={Link} to={"/userProfile/"+profile.username}>
    <Image src={profile.avatar ? profile.avatar : userIcon} wrapped ui={false} />
    <Card.Content>
      <Card.Header textAlign="center">{profile.username}</Card.Header>
      
      <Card.Description>
        {profile.bio}
      </Card.Description>
     
    </Card.Content>
    
  </Card>
)

export default UserCard;
