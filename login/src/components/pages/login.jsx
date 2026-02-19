import React, { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { FaFacebook } from "react-icons/fa";
import {
  PageContainer, OuterCard, InnerCard, LogoContainer, LogoBox,
  BrandName, Heading, Subheading, Form, Input, SignInButton,
  Footer, SignUpLink, Divider, DividerLine, DividerText,
  RoleDropdownContainer, RoleButton, DropdownMenu, DropdownItem,
  ContinueText, SocialButtonsContainer, SocialButton, IconWrapper,
} from "./Styled_components/Login.styled";

// Props mein onLogin receive karein
const Login = ({ onLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("User");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const roles = ["User", "Reviewer", "Business", "Admin"];

  const handleSubmit = (e) => {
    e.preventDefault();
    // Yahan App.jsx ke function ko call karein aur role pass karein
    if (onLogin) {
      onLogin(role);
    }
  };

  const handleRoleButtonClick = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleRoleSelect = (selectedRole) => {
    setRole(selectedRole);
    setIsDropdownOpen(false);
  };

  return (
    <PageContainer>
      <OuterCard>
        <InnerCard>
          <LogoContainer>
            <LogoBox>✓</LogoBox>
            <BrandName>Verity</BrandName>
          </LogoContainer>

          <Heading>Welcome Back</Heading>
          <Subheading>Sign in to your Verity account</Subheading>

          <Form onSubmit={handleSubmit}>
            <Input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            
            {/* Role Selection Dropdown yahan form ke upar ya button ke paas */}
            <RoleDropdownContainer>
              <RoleButton
                type="button"
                onClick={handleRoleButtonClick}
                $isOpen={isDropdownOpen}
              >
                Login as {role}
              </RoleButton>
              <DropdownMenu $isOpen={isDropdownOpen}>
                {roles.map((roleOption) => (
                  <DropdownItem
                    key={roleOption}
                    type="button"
                    $isSelected={role === roleOption}
                    onClick={() => handleRoleSelect(roleOption)}
                  >
                    {roleOption}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </RoleDropdownContainer>

            <SignInButton type="submit">Sign In</SignInButton>
          </Form>

          <Footer>
            Don't have an account? <SignUpLink>Sign up</SignUpLink>
          </Footer>

          <Divider>
            <DividerLine />
            <DividerText>or</DividerText>
            <DividerLine />
          </Divider>

          <ContinueText>Or continue with</ContinueText>

          <SocialButtonsContainer>
            <SocialButton type="button" onClick={() => alert("Google Login")}>
              <IconWrapper><FcGoogle /></IconWrapper>
              Google
            </SocialButton>
            <SocialButton type="button" onClick={() => alert("FB Login")}>
              <IconWrapper><FaFacebook color="#1877f2" /></IconWrapper>
              Facebook
            </SocialButton>
          </SocialButtonsContainer>
        </InnerCard>
      </OuterCard>
    </PageContainer>
  );
};

export default Login;