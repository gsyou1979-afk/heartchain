import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToMany,
} from 'typeorm';

export enum UserRole {
  VOLUNTEER = 'volunteer',
  ORGANIZATION = 'organization',
  SKILL_PROVIDER = 'skill_provider',
  DONOR = 'donor',
  ADMIN = 'admin',
}

export enum UserStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  BANNED = 'banned',
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 20, unique: true, nullable: false })
  phone: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  password: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  nickname: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  avatar: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  email: string;

  @Column({ type: 'varchar', length: 20, default: UserRole.VOLUNTEER })
  role: UserRole;

  @Column({ type: 'varchar', length: 20, default: UserStatus.ACTIVE })
  status: UserStatus;

  @Column({ type: 'integer', default: 0, comment: 'Credit score 0-1000' })
  creditScore: number;

  @Column({ type: 'float', default: 0, comment: 'HeartCoin balance' })
  pointBalance: number;

  @Column({ type: 'varchar', length: 42, nullable: true, comment: 'Blockchain wallet address' })
  walletAddress: string;

  @Column({ type: 'varchar', length: 18, nullable: true, comment: 'Real name (for verified users)' })
  realName: string;

  @Column({ type: 'varchar', length: 18, nullable: true, comment: 'ID card number' })
  idCard: string;

  @Column({ type: 'boolean', default: false, comment: 'Is phone verified' })
  phoneVerified: boolean;

  @Column({ type: 'boolean', default: false, comment: 'Is real-name verified' })
  realNameVerified: boolean;

  @Column({ type: 'varchar', length: 50, nullable: true, comment: 'Region: cn / kr / global' })
  region: string;

  @Column({ type: 'varchar', length: 255, nullable: true, comment: 'Bio / introduction' })
  bio: string;

  @Column({ type: 'simple-json', nullable: true, comment: 'Skill tags e.g. ["medical","legal"]' })
  skills: string[];

  @Column({ type: 'simple-json', nullable: true, comment: 'Education array e.g. [{level, school, year}]' })
  education: { level: string; school: string; year: string }[];

  @Column({ type: 'boolean', default: false, comment: 'Agree to receive promotional messages' })
  agreePromotional: boolean;

  @Column({ type: 'varchar', length: 20, nullable: true })
  language: string;

  @Column({ type: 'simple-json', nullable: true, comment: 'Location {lat, lng, city, address}' })
  location: {
    lat: number;
    lng: number;
    city: string;
    address: string;
  };

  @Column({ type: 'boolean', default: true, comment: 'Enable ads display' })
  adEnabled: boolean;

  @Column({ type: 'simple-json', nullable: true, comment: 'Ad preferences {projectAds, charityAds, commercialAds}' })
  adPreferences: {
    projectAds: boolean;
    charityAds: boolean;
    commercialAds: boolean;
  };

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}
