import styled from 'styled-components'
import { Link } from 'react-router-dom'
import Card from '../../components/Card'
import colors from '../../utils/style/colors'
import { Loader } from '../../utils/style/Atoms'
import { useSelector, useStore } from 'react-redux'
import { selectFreelances, selectTheme } from '../../utils/selectors'
import { fetchOrUpdateFeelances } from '../../features/freelances'
import { useEffect } from 'react'

const CardsContainer = styled.div`
  display: grid;
  gap: 24px;
  grid-template-rows: 350px 350px;
  grid-template-columns: repeat(2, 1fr);
  align-items: center;
  justify-items: center;
`

const PageTitle = styled.h1`
  font-size: 30px;
  text-align: center;
  padding-bottom: 30px;
  color: ${({ theme }) => (theme === 'light' ? '#000000' : '#ffffff')};
`

const PageSubtitle = styled.h2`
  font-size: 20px;
  color: ${colors.secondary};
  font-weight: 300;
  text-align: center;
  padding-bottom: 30px;
  color: ${({ theme }) => (theme === 'light' ? '#000000' : '#ffffff')};
`

const LoaderWrapper = styled.div`
  display: flex;
  justify-content: center;
`

function Freelances() {
  const theme = useSelector(selectTheme)

  const freelances = useSelector(selectFreelances)

  const freelancersList = freelances.data?.freelancersList

  const store = useStore()

  useEffect(() => {
    fetchOrUpdateFeelances(store)
  }, [store])

  if (freelances.status === 'rejected') {
    return <span>Il y a un problème</span>
  }

  const isLoading =
    freelances.status === 'void' || freelances.status === 'pending'

  return (
    <div>
      <PageTitle theme={theme}>Trouvez votre prestataire</PageTitle>
      <PageSubtitle theme={theme}>
        Chez Shiny nous réunissons les meilleurs profils pour vous.
      </PageSubtitle>
      {isLoading ? (
        <LoaderWrapper>
          <Loader theme={theme} data-testid="loader" />
        </LoaderWrapper>
      ) : (
        <CardsContainer>
          {freelancersList?.map((profile) => (
            <Link key={`freelance-${profile.id}`} to={`/profile/${profile.id}`}>
              <Card
                label={profile.job}
                title={profile.name}
                picture={profile.picture}
                theme={theme}
              />
            </Link>
          ))}
        </CardsContainer>
      )}
    </div>
  )
}

export default Freelances
