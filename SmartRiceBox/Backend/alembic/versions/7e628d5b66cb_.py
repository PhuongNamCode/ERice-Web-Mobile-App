"""empty message

Revision ID: 7e628d5b66cb
Revises: 
Create Date: 2023-09-25 15:27:25.539851

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '7e628d5b66cb'
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('users',
    sa.Column('id', sa.BigInteger(), nullable=False),
    sa.Column('phone_num', sa.String(length=20), nullable=False),
    sa.Column('role', sa.String(length=20), nullable=False),
    sa.Column('password', sa.String(length=100), nullable=False),
    sa.Column('created_at', sa.TIMESTAMP(timezone=True), server_default=sa.text('now()'), nullable=False),
    sa.PrimaryKeyConstraint('id'),
    sa.UniqueConstraint('phone_num')
    )
    op.create_table('ricebox',
    sa.Column('id', sa.BigInteger(), nullable=False),
    sa.Column('access_token', sa.String(length=100), nullable=False),
    sa.Column('name', sa.String(length=100), nullable=False),
    sa.Column('house_num_street', sa.String(length=100), nullable=False),
    sa.Column('ward', sa.String(length=100), nullable=False),
    sa.Column('district', sa.String(length=100), nullable=False),
    sa.Column('city', sa.String(length=100), nullable=False),
    sa.Column('owner_id', sa.BigInteger(), nullable=True),
    sa.Column('alarm_rice_threshold', sa.Integer(), nullable=False),
    sa.Column('current_rice_amount', sa.Integer(), nullable=True),
    sa.Column('current_humidity', sa.Integer(), nullable=True),
    sa.Column('current_temperature', sa.Integer(), nullable=True),
    sa.Column('longitude', sa.Float(), nullable=True),
    sa.Column('latitude', sa.Float(), nullable=True),
    sa.Column('url_dashboard', sa.String(length=300), nullable=True),
    sa.Column('have_buy_rice_request', sa.Boolean(), nullable=True),
    sa.Column('tick_deliver', sa.Boolean(), nullable=True),
    sa.ForeignKeyConstraint(['owner_id'], ['users.id'], ondelete='CASCADE'),
    sa.PrimaryKeyConstraint('id'),
    sa.UniqueConstraint('access_token')
    )
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('ricebox')
    op.drop_table('users')
    # ### end Alembic commands ###
