import React from 'react';
import { createFragmentContainer, graphql } from 'react-relay';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

const InputWrapper = styled.div`
`;

const ButtonWrapper = styled.div`
  margin-top: 16px;
`;

class EditPost extends React.Component {
  componentWillMount() {
    this.setState({
      post: this.props.post,
    });
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.post !== nextProps.post) {
      this.setState({
        post: nextProps.post,
      });
    }
  }

  onChange = (data) => {
    this.setState({
      post: {
        ...this.state.post,
        ...data,
      },
    });
  }

  render() {
    const {
      errors,
      submitDisabled,
      onSubmit,
    } = this.props;

    const {
      post,
    } = this.state;

    return (
      <Wrapper>
        <InputWrapper>
          <TextField
            fullWidth
            floatingLabelText={'Name'}
            errorText={errors && errors.name}
            value={post.name}
            onChange={(event) => this.onChange({ name: event.target.value })}
          />
        </InputWrapper>
        <InputWrapper>
          <TextField
            fullWidth
            floatingLabelText={'Slug'}
            errorText={errors && errors.slug}
            value={post.slug}
            onChange={(event) => this.onChange({ slug: event.target.value })}
          />
        </InputWrapper>
        <InputWrapper>
          <TextField
            fullWidth
            floatingLabelText={'Description'}
            errorText={errors && errors.description}
            value={post.description}
            onChange={(event) => this.onChange({ description: event.target.value })}
            multiLine
            rows={3}
          />
        </InputWrapper>
        <InputWrapper>
          <TextField
            fullWidth
            floatingLabelText={'Logo Image Url'}
            errorText={errors && errors.logoImage}
            value={post.logoImage}
            onChange={(event) => this.onChange({ logoImage: event.target.value })}
          />
        </InputWrapper>
        <InputWrapper>
          <TextField
            fullWidth
            floatingLabelText={'Cover Image Url'}
            errorText={errors && errors.coverImage}
            value={post.coverImage}
            onChange={(event) => this.onChange({ coverImage: event.target.value })}
          />
        </InputWrapper>
        <ButtonWrapper>
          <RaisedButton
            label={'Save'}
            disabled={submitDisabled}
            onClick={() => onSubmit(post)}
          />
        </ButtonWrapper>
      </Wrapper>
    );
  }
}

EditPost.propTypes = {
  post: PropTypes.shape({
    name: PropTypes.string,
    slug: PropTypes.string,
    description: PropTypes.string,
    coverImage: PropTypes.string,
    logoImage: PropTypes.string,
  }).isRequired,
  errors: PropTypes.shape({
    name: PropTypes.string,
    slug: PropTypes.string,
    description: PropTypes.string,
    coverImage: PropTypes.string,
    logoImage: PropTypes.string,
  }),
  submitDisabled: PropTypes.bool,
  onSubmit: PropTypes.func.isRequired,
};

export default createFragmentContainer(
  EditPost,
  graphql`
    fragment EditPost_post on Post {
      id
      name
      slug
      description
      coverImage
      logoImage
    }
  `
);
