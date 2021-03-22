import React , { PureComponent }  from 'react';
import {StyleSheet,View,Text, Button} from 'react-native';
import stripe from 'tipsi-stripe';
// import Button from './components/Button'

stripe.setOptions({
  publishableKey:'pk_test_51HU8ifBKUe1vdV2ZZEEKOpt2NS1oTdrZ8GcW0rdo1YtMHTPYLHHlrkXcxKv7MjkZ7xqX5dBAQeWWM4NAWKptQa3r00n6szwXTg'
})

export default class App extends PureComponent {
  static title = 'Card Form'

  state = {
    loading: false,
    token: null,
    params: {
      number: '4242424242424242',
      expMonth: 12,
      expYear: 24,
      cvc: '223',
      name: 'Test User',
      currency: 'usd',
      addressLine1: '123 Test Street',
      addressLine2: 'Apt. 5',
      addressCity: 'Test City',
      addressState: 'Test State',
      addressCountry: 'Test Country',
      addressZip: '55555',
    },
  }

  handleCustomPayPress = async (shouldPass = true) => {
    console.log('here')
    try {
      this.setState({ loading: true, token: null, error: null })

      const token = await stripe.createTokenWithCard(this.state.params)
      this.setState({ loading: false, error: undefined, token })
      console.log('token custom: ',token)
    } catch (error) {
      console.log('catch: ',error)
      this.setState({ loading: false, error })
    }
  }

  handleCardPayPress = async () => {
    try {
      this.setState({ loading: true, token: null })
      const token = await stripe.paymentRequestWithCardForm({
        // Only iOS support this options
        smsAutofillDisabled: true,
        requiredBillingAddressFields: 'full',
        prefilledInformation: {
          billingAddress: {
            name: 'Gunilla Haugeh',
            line1: 'Canary Place',
            line2: '3',
            city: 'Macon',
            state: 'Georgia',
            country: 'US',
            postalCode: '31217',
            email: 'ghaugeh0@printfriendly.com',
          },
        },
      })

      this.setState({ loading: false, token })
    } catch (error) {
      this.setState({ loading: false })
    }
  }

  render() {
    const { loading, token } = this.state
    console.log(token)

    return (
      <View style={styles.container}>
        <Text style={styles.header}>
          Card Form Example
        </Text>
        <Text style={styles.instruction}>
          Click button to show Card Form dialog.
        </Text>
        {/* <Button
          text="Enter your card and pay"
          loading={loading}
          onPress={this.handleCardPayPress}
        /> */}
        <Button title="Submit" onPress={()=>this.handleCardPayPress()}/>
        <Button title="Create token" onPress={()=>this.handleCustomPayPress()}/>
        <View
          style={styles.token}
          >
          {token &&
            <Text style={styles.instruction}>
              Token: {token.tokenId}
            </Text>
          }
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instruction: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
  token: {
    height: 20,
  },
})
