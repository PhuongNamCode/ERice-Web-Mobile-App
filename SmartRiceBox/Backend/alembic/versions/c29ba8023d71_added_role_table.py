"""Added role table

Revision ID: c29ba8023d71
Revises: f14068b8f0ec
Create Date: 2024-08-05 11:12:14.618794

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'c29ba8023d71'
down_revision: Union[str, None] = 'f14068b8f0ec'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('ricebox', sa.Column('provider_id', sa.BigInteger(), nullable=True))
    op.create_foreign_key(None, 'ricebox', 'users', ['provider_id'], ['id'], ondelete='CASCADE')
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_constraint(None, 'ricebox', type_='foreignkey')
    op.drop_column('ricebox', 'provider_id')
    # ### end Alembic commands ###
