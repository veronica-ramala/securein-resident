import React from 'react';
import { ScrollView, TouchableOpacity, View, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Shield, Users, Settings } from 'lucide-react-native';
import { 
  ResponsiveWrapper, 
  ResponsiveView, 
  ResponsiveCard, 
  ResponsiveButton,
  useResponsive 
} from './ResponsiveWrapper';
import { ResponsiveText } from './ResponsiveText';

// Example of how to use the responsive system in a screen component
const ResponsiveDemo: React.FC = () => {
  return (
    <ResponsiveWrapper 
      useSafeArea={true}
      backgroundColor="#F8F9FA"
      horizontalPadding={true}
      verticalPadding={true}
    >
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header Section */}
        <ResponsiveView width={100} padding={1}>
          <ResponsiveText 
            size="xxlarge" 
            weight="bold" 
            color="#1A1A1A"
            useDynamicSizing={true}
          >
            Welcome to SecureIn
          </ResponsiveText>
          <ResponsiveText 
            size="medium" 
            color="#666666"
            useDynamicSizing={true}
            style={{ marginTop: 8 }}
          >
            Your community management solution
          </ResponsiveText>
        </ResponsiveView>

        {/* Stats Cards */}
        <StatsSection />

        {/* Feature Cards */}
        <FeatureSection />

        {/* Action Buttons */}
        <ActionButtonsSection />
      </ScrollView>
    </ResponsiveWrapper>
  );
};

// Stats section component using responsive utilities
const StatsSection: React.FC = () => {
  const { responsive, dimensions } = useResponsive();

  const statsData = [
    { title: 'Active Users', value: '1,234', icon: Users, color: '#0077B6' },
    { title: 'Security Alerts', value: '12', icon: Shield, color: '#FF6B6B' },
    { title: 'Services', value: '45', icon: Settings, color: '#4ECDC4' },
  ];

  return (
    <ResponsiveView width={100} style={{ marginVertical: responsive.spacing.large }}>
      <ResponsiveText 
        size="large" 
        weight="600" 
        color="#1A1A1A"
        useDynamicSizing={true}
        style={{ marginBottom: responsive.spacing.medium }}
      >
        Community Stats
      </ResponsiveText>
      
      <View style={[
        styles.statsContainer,
        { 
          flexDirection: dimensions.isTablet ? 'row' : 'column',
          gap: responsive.spacing.medium 
        }
      ]}>
        {statsData.map((stat, index) => (
          <ResponsiveCard 
            key={index}
            columns={dimensions.isTablet ? 3 : 1}
            style={[
              styles.statCard,
              { 
                flex: dimensions.isTablet ? 1 : undefined,
                minHeight: responsive.hp(12)
              }
            ]}
          >
            <View style={styles.statContent}>
              <View style={[styles.statIconContainer, { backgroundColor: stat.color + '20' }]}>
                <stat.icon 
                  size={responsive.isTablet ? 28 : 24} 
                  color={stat.color} 
                />
              </View>
              <View style={styles.statTextContainer}>
                <ResponsiveText 
                  size="huge" 
                  weight="bold" 
                  color={stat.color}
                  useDynamicSizing={true}
                >
                  {stat.value}
                </ResponsiveText>
                <ResponsiveText 
                  size="small" 
                  color="#666666"
                  useDynamicSizing={true}
                >
                  {stat.title}
                </ResponsiveText>
              </View>
            </View>
          </ResponsiveCard>
        ))}
      </View>
    </ResponsiveView>
  );
};

// Feature section with responsive grid
const FeatureSection: React.FC = () => {
  const { responsive, dimensions } = useResponsive();

  const features = [
    { title: 'Gate Management', description: 'Control access to your community', color: '#0077B6' },
    { title: 'Visitor Tracking', description: 'Monitor and manage visitors', color: '#4ECDC4' },
    { title: 'Emergency Alerts', description: 'Quick emergency notifications', color: '#FF6B6B' },
    { title: 'Community Events', description: 'Stay updated with events', color: '#45B7D1' },
  ];

  const columns = dimensions.isTablet ? 2 : 1;

  return (
    <ResponsiveView width={100} style={{ marginVertical: responsive.spacing.large }}>
      <ResponsiveText 
        size="large" 
        weight="600" 
        color="#1A1A1A"
        useDynamicSizing={true}
        style={{ marginBottom: responsive.spacing.medium }}
      >
        Key Features
      </ResponsiveText>
      
      <View style={[
        styles.featuresGrid,
        { 
          flexDirection: 'row',
          flexWrap: 'wrap',
          gap: responsive.spacing.medium
        }
      ]}>
        {features.map((feature, index) => (
          <ResponsiveCard 
            key={index}
            columns={columns}
            style={[
              styles.featureCard,
              { 
                width: responsive.getCardWidth(columns, responsive.spacing.medium),
                minHeight: responsive.hp(15)
              }
            ]}
          >
            <LinearGradient
              colors={[feature.color + '10', feature.color + '05']}
              style={styles.featureGradient}
            >
              <ResponsiveText 
                size="medium" 
                weight="600" 
                color="#1A1A1A"
                useDynamicSizing={true}
                style={{ marginBottom: responsive.spacing.small }}
              >
                {feature.title}
              </ResponsiveText>
              <ResponsiveText 
                size="small" 
                color="#666666"
                useDynamicSizing={true}
              >
                {feature.description}
              </ResponsiveText>
            </LinearGradient>
          </ResponsiveCard>
        ))}
      </View>
    </ResponsiveView>
  );
};

// Action buttons section
const ActionButtonsSection: React.FC = () => {
  const { responsive, dimensions } = useResponsive();

  return (
    <ResponsiveView width={100} style={{ marginVertical: responsive.spacing.large }}>
      <View style={[
        styles.buttonContainer,
        { 
          flexDirection: dimensions.isTablet ? 'row' : 'column',
          gap: responsive.spacing.medium
        }
      ]}>
        <ResponsiveButton 
          fullWidth={!dimensions.isTablet}
          style={[
            styles.primaryButton,
            { 
              flex: dimensions.isTablet ? 1 : undefined,
              backgroundColor: '#0077B6'
            }
          ]}
        >
          <TouchableOpacity style={styles.buttonTouchable}>
            <ResponsiveText 
              size="medium" 
              weight="600" 
              color="#FFFFFF"
              useDynamicSizing={true}
            >
              Get Started
            </ResponsiveText>
          </TouchableOpacity>
        </ResponsiveButton>

        <ResponsiveButton 
          fullWidth={!dimensions.isTablet}
          style={[
            styles.secondaryButton,
            { 
              flex: dimensions.isTablet ? 1 : undefined,
              borderColor: '#0077B6',
              borderWidth: 2
            }
          ]}
        >
          <TouchableOpacity style={styles.buttonTouchable}>
            <ResponsiveText 
              size="medium" 
              weight="600" 
              color="#0077B6"
              useDynamicSizing={true}
            >
              Learn More
            </ResponsiveText>
          </TouchableOpacity>
        </ResponsiveButton>
      </View>
    </ResponsiveView>
  );
};

const styles = StyleSheet.create({
  statsContainer: {
    width: '100%',
  },
  statCard: {
    backgroundColor: '#FFFFFF',
  },
  statContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  statTextContainer: {
    flex: 1,
  },
  featuresGrid: {
    width: '100%',
  },
  featureCard: {
    backgroundColor: '#FFFFFF',
    overflow: 'hidden',
  },
  featureGradient: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
  },
  buttonContainer: {
    width: '100%',
  },
  primaryButton: {
    borderRadius: 12,
  },
  secondaryButton: {
    borderRadius: 12,
    backgroundColor: 'transparent',
  },
  buttonTouchable: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ResponsiveDemo;